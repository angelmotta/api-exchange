import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  readonly purchasePrice = 3.68;
  readonly salePrice = 3.86;

  private orders: Order[] = [
    {
      id: '1',
      tipoCambio: 'compra',
      montoEnviar: 100,
      montoRecibir: 100 * this.purchasePrice,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      tipoCambio: 'venta',
      montoEnviar: 100,
      montoRecibir: 100 / this.salePrice,
      createdAt: new Date().toISOString(),
    },
  ];

  create(createOrderDto: CreateOrderDto) {
    // Calculate total amount to receive
    let montoRecibir;
    if (createOrderDto.tipoCambio === 'compra') {
      montoRecibir = createOrderDto.montoEnviar * this.purchasePrice;
    } else if (createOrderDto.tipoCambio === 'venta') {
      montoRecibir = createOrderDto.montoEnviar / this.salePrice;
    } else {
      throw new Error('Invalid tipo_cambio value');
    }

    // Create new order
    const newOrder: Order = {
      id: (this.orders.length + 1).toString(),
      ...createOrderDto,
      montoRecibir,
      createdAt: new Date().toISOString(),
    };

    // TODO: save order to database
    this.orders.push(newOrder);

    // return new order
    return newOrder;
  }

  findAll() {
    return this.orders;
  }

  findOne(id: string) {
    const order = this.orders.find((order) => order.id === id);
    if (!order) {
      // HTTP status code 404 (Not Found)
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  remove(id: string): boolean {
    const initialLength = this.orders.length;
    this.orders = this.orders.filter((order) => order.id !== id);
    if (this.orders.length === initialLength) {
      // No order was removed
      return false;
    }
    return true;
  }
}
