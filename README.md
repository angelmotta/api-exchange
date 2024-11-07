# API Currency Exchange Project

# Descripción general

Rest API que permite ingresar precios de compra y venta de divisas.

## Project Stack

De acuerdo a los requerimientos del proyecto, se ha decidido utilizar las siguientes tecnologías:

- NestJS
- MongoDB
- Docker

## Project Features

- Se implementaron las operaciones Create, Read, Update and Delete (CRUD) del objeto `Orders` (ordenes de compra/venta de divisas). La implementación incluye `paginación` retornar de forma controlada una determinada cantidad de `orders`.
- Se implementaron las operaciones Create, Read, Update `Rates` (precios de compra/venta de divisas: USD/PEN)
- User Authentication: `Register` para registrarse y `Login` para autenticarse (Include generate JWT token) y almacenamiento de passwords como hash para mayor seguridad.
- Se incluye validación de `requests` usando `DTOs` (Data Transfer Objects) para asegurar que los datos ingresados por el cliente son válidos.
- Se incluye `error handling` para manejar errores de forma controlada y retornar mensajes de error amigables al cliente.
- Se incluye un `Dockerfile` para desplegar la aplicación REST API en un contenedor Docker. Así mismo se incluye un archivo `docker-compose.yml` para correr la aplicación y una base de datos MongoDB en contenedores separados.

# Project structure

El servicio tiene una organización basada en `features` y esta compuesto por diferentes `modulos` como `orders`, `rates`, `users`. Esto con la finalidad de facilitar la mantenibilidad del código.

```bash
currency-exchange-api
├── src
│   ├── common
│   ├── config
│   │   ├── database.config.ts
│   │   ├── env.config.ts
│   ├── orders
│   │   ├── dto
│   │   ├── schemas
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   ├── orders.service.ts
│   ├── rates
│   │   ├── dto
│   │   ├── schemas
│   │   ├── rates.controller.ts
│   │   ├── rates.module.ts
│   │   ├── rates.service.ts
│   ├── users
│   │   ├── dto
│   │   ├── schemas
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   ├── app.module.ts
│   ├── main.ts
│
│── .env.development
│── Dockerfile
│── docker-compose.yml
```

# Base de datos

## Order

El `schema` utilizado para el objeto `Order` incluye los siguientes campos tal como está definido en [order/schemas/order.schema.ts](./src/orders/schemas/order.schema.ts).

```typescript
export class Order {
  id?: string;

  @Prop({ required: true })
  tipoCambio: string;

  @Prop({ required: true, type: Number })
  montoEnviar: number;

  @Prop({ required: true, type: Number })
  montoRecibir: number;

  @Prop({
    type: {
      currencyPair: String,
      purchasePrice: Number,
      salePrice: Number,
      createdAt: Date,
      updatedAt: Date,
    },
    required: true,
  })
  rate: Rate; // Save Rate object (not a reference)
  createdAt: Date;
  updatedAt: Date;
}
```

En este mismo file se ha incluido un `índice` en el campo `createdAt` para mejorar la performance de las consultas que requieran ordenar por fecha de creación.

```typescript
OrderSchema.index({ createdAt: 1 });
```

# REST API

Se prestó especial atención en seguir el standard HTTP para la implementación de los endpoints usando los `verbos HTTP` de acuerdo a las operaciones CRUD en los recursos `orders` y `rates` del REST API así como los `HTTP status codes` usados para las respuestas.

## Rates

Un `rate` representa un tiempo de cambio entre un par de monedas `USD/PEN` para esta versión del API.
Esta versión del API aun no tiene una función de `seed` data implementado por lo que se debe crear primero un `rate` de la siguiente forma para registrar ordenes de compra/venta `orders`

### Crear nuevo `rate`

POST `http://localhost:3000/api/v1.1/config/rates`

Request body:

```json
{
  "currencyPair": "USDPEN",
  "purchasePrice": 3.6,
  "salePrice": 3.7
}
```

Status: 201 Created

Response body:

```json
{
  "currencyPair": "USDPEN",
  "purchasePrice": 3.6,
  "salePrice": 3.7,
  "createdAt": "2024-11-07T22:11:04.792Z",
  "updatedAt": "2024-11-07T22:11:04.792Z",
  "id": "672d3af8a6d814a93b85cb33"
}
```

### Obtener todos los `rates`

GET `http://localhost:3000/api/v1.1/config/rates`

Response body:

```json
[
  {
    "currencyPair": "USDPEN",
    "purchasePrice": 3.75,
    "salePrice": 3.85
  }
]
```

### Actualizar precio de `rate`

PUT `http://localhost:3000/api/v1.1/config/rates/{ID}`

Request body:

```json
{
  "purchasePrice": 3.7,
  "salePrice": 3.9
}
```

Status: 200 OK

Response body:

```json
{
  "currencyPair": "USDPEN",
  "purchasePrice": 3.7,
  "salePrice": 3.9,
  "createdAt": "2024-11-07T15:38:28.418Z",
  "updatedAt": "2024-11-07T19:24:12.852Z",
  "id": "672cdef43152ffa091749405"
}
```

## Orders

### Crear nueva `order`

- Siguiendo el standard HTTP, el cliente recibe el URL con el detalle de su `order` como `http://localhost:3000/api/v1.1/orders/{ID}` el cual es retornado en el HTTP Header `Location` como parte de la respuesta de creación de la `order`
- La `order` registrada incluye el `rate` usado para la conversión de divisas en el momento de la creación de la `order`.
- Esta versión del API asume que la solicitud es cambio entre soles/dolares (USD/PEN) sin embargo, se puede extender para otros tipos de cambio ya que se cuenta con una colección de `rates` (actualmente con solo USD/PEN pero extensible a otras monedas)

POST `http://localhost:3000/api/v1.1/orders`

Request body:

```json
{
  "tipoCambio": "compra",
  "montoEnviar": 45
}
```

Status: 201 Created

HTTP Headers:

Location: `http://localhost:3000/api/v1.1/orders/672d3d37a6d814a93b85cb36`

Response body:

```json
{
  "id": "672d3d37a6d814a93b85cb36",
  "tipoCambio": "compra",
  "montoEnviar": 45,
  "montoRecibir": 162,
  "rate": {
    "id": "672d3af8a6d814a93b85cb33",
    "currencyPair": "USDPEN",
    "purchasePrice": 3.6,
    "salePrice": 3.7,
    "createdAt": "2024-11-07T22:11:04.792Z",
    "updatedAt": "2024-11-07T22:11:04.792Z"
  },
  "createdAt": "2024-11-07T22:20:39.495Z",
  "updatedAt": "2024-11-07T22:20:39.495Z"
}
```

### Obtener detalle de una `order`

GET `http://localhost:3000/api/v1.1/orders/{ID}`

Response body:

```json
{
  "tipoCambio": "compra",
  "montoEnviar": 45,
  "montoRecibir": 162,
  "rate": {
    "currencyPair": "USDPEN",
    "purchasePrice": 3.6,
    "salePrice": 3.7,
    "createdAt": "2024-11-07T22:11:04.792Z",
    "updatedAt": "2024-11-07T22:11:04.792Z",
    "_id": "672d3d37a6d814a93b85cb37"
  },
  "createdAt": "2024-11-07T22:20:39.495Z",
  "updatedAt": "2024-11-07T22:20:39.495Z",
  "id": "672d3d37a6d814a93b85cb36"
}
```

Se incluye el `rate` con la información del precio usado en el momento del request. Se ha considerado esto en el `schema` de la base da datos. De esta forma se asegura que actualizaciones posteriores de precio en el `rate` no afecten el valor usado en transacciones pasadas. Esto hace más sencillo auditar transacciones históricas.

### Obtener todas las `orders`

Se ha implementado paginación para obtener todas las `orders` registradas. Por defecto el cliente recibe 20 `orders` por página si no especifica el tamaño de página en el query params del request

GET `http://localhost:3000/api/v1.1/orders`

Status: 200 OK

Response body:

```json
{
  "orders": [
    {
      "tipoCambio": "compra",
      "montoEnviar": 45,
      "montoRecibir": 162,
      "rate": {
        "currencyPair": "USDPEN",
        "purchasePrice": 3.6,
        "salePrice": 3.7,
        "createdAt": "2024-11-07T22:11:04.792Z",
        "updatedAt": "2024-11-07T22:11:04.792Z",
        "_id": "672d3d37a6d814a93b85cb37"
      },
      "createdAt": "2024-11-07T22:20:39.495Z",
      "updatedAt": "2024-11-07T22:20:39.495Z",
      "id": "672d3d37a6d814a93b85cb36"
    },
    {
      "tipoCambio": "compra",
      "montoEnviar": 115,
      "montoRecibir": 414,
      "rate": {
        "currencyPair": "USDPEN",
        "purchasePrice": 3.6,
        "salePrice": 3.7,
        "createdAt": "2024-11-07T22:11:04.792Z",
        "updatedAt": "2024-11-07T22:11:04.792Z",
        "_id": "672d3f30a6d814a93b85cb3e"
      },
      "createdAt": "2024-11-07T22:29:04.317Z",
      "updatedAt": "2024-11-07T22:29:04.317Z",
      "id": "672d3f30a6d814a93b85cb3d"
    }
  ],
  "totalOrders": 2,
  "pageNumber": 0,
  "pageSize": 20
}
```

### Obtener todas las `orders` con paginación

Usando los query params `page` y `size` el cliente puede obtener todas las `orders` registradas con la paginación que necesite.

GET `http://localhost:3000/api/v1.1/orders?page=0&size=1`

Response body:

Status: 200 OK

```json
{
  "orders": [
    {
      "tipoCambio": "compra",
      "montoEnviar": 45,
      "montoRecibir": 162,
      "rate": {
        "currencyPair": "USDPEN",
        "purchasePrice": 3.6,
        "salePrice": 3.7,
        "createdAt": "2024-11-07T22:11:04.792Z",
        "updatedAt": "2024-11-07T22:11:04.792Z",
        "_id": "672d3d37a6d814a93b85cb37"
      },
      "createdAt": "2024-11-07T22:20:39.495Z",
      "updatedAt": "2024-11-07T22:20:39.495Z",
      "id": "672d3d37a6d814a93b85cb36"
    }
  ],
  "totalOrders": 3,
  "pageNumber": 0,
  "pageSize": 1
}
```

### Eliminar una `order`

DELETE `http://localhost:3000/api/v1.1/orders/{ID}`

Status: 204 No Content

Response body: No content

## Users

### Registrar un nuevo usuario

La creación de un nuevo usuario incluye la generación de un `JWT token` como parte de la respuesta. Este token tiene un tiempo de vida de 24 horas (configurable)

POST `http://localhost:3000/api/v1.1/users`

Request body

```json
{
  "email": "angelmotta@gmail.com",
  "password": "qwerty123"
}
```

Status: 201 Created

Response body

```json
{
  "id": "672d3323be548be27013f4e4",
  "email": "angelmotta@gmail.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmdlbG1vdHRhQGdtYWlsLmNvbSIsImlhdCI6MTczMTAxNTQ2MCwiZXhwIjoxNzMxMTAxODYwfQ.H61R8GsSJnoZL8NwKrUH-d8kcEYCQWWMAWTb5_vDpj0",
  "createdAt": "2024-11-07T21:37:39.936Z",
  "updatedAt": "2024-11-07T21:37:39.936Z"
}
```

### Autenticar un usuario

GET `http://localhost:3000/api/v1.1/users/login`

Request body

```json
{
  "email": "angelmotta@gmail.com",
  "password": "qwerty123"
}
```

Status: 200 OK

Response body

```json
{
  "id": "672d4589a6d814a93b85cb4b",
  "email": "angelmotta@gmail.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmdlbG1vdHRhQGdtYWlsLmNvbSIsImlhdCI6MTczMTAyMDE3MywiZXhwIjoxNzMxMTA2NTczfQ.4QEX7WzpIR3pW0wY0wSvRuaudpVlZEk_dzeZbVWd6ZI",
  "createdAt": "2024-11-07T22:56:09.639Z",
  "updatedAt": "2024-11-07T22:56:09.639Z"
}
```

## How to run the project

### Correr el proyecto por primera vez

Esto hace un build usando el Dockerfile de la aplicación REST API y descarga una imagen standard de MongoDB del registry público de Docker

```bash
docker compose up --build -d
```

### Verificar que los contenedores están corriendo

```bash
docker compose ps
```

### Verificar los logs del REST API

```bash
docker compose logs api
```

El siguiente mensaje de `log` indica que la aplicación inició de forma exitosa

```bash
LOG [NestApplication] Nest application successfully started +2ms
```

### Detener los servicios

```bash
docker compose stop
```

## Deploy

- Utilizando el Dockerfile se puede utilizar un servicio de CI/CD para desplegar la aplicación de forma automática.
- Se puede utilizar un servicio de orquestación de contenedores como Kubernetes para escalar la aplicación y manejar el tráfico de forma eficiente.

## Alcance y limitaciones

- Por dificultad de tiempo, en esta versión actual del API no tiene implementado los middleware de autorización.
