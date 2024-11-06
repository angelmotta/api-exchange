import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  readonly purchasePrice = 3.68;
  readonly salePrice = 3.86;

  private orders: Order[] = [
    {
      id: '1',
      tipo_cambio: 'compra',
      monto_enviar: 100,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      tipo_cambio: 'compra',
      monto_enviar: 200,
      created_at: new Date().toISOString(),
    },
  ];

  create(createOrderDto: CreateOrderDto) {
    const newOrder = {
      id: (this.orders.length + 1).toString(),
      ...createOrderDto,
      created_at: new Date().toISOString(),
    };
    this.orders.push(newOrder);
  }

  findAll() {
    return this.orders;
  }

  findOne(id: string) {
    return this.orders.find((order) => order.id === id);
  }

  remove(id: string) {
    this.orders = this.orders.filter((order) => order.id !== id);
  }
}
