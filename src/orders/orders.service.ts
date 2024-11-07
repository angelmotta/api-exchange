import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
// import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { OrderEntity } from './entities/order.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResponseOrdersDto } from './dto/response-orders.dto';

@Injectable()
export class OrdersService {
  readonly purchasePrice = 3.68;
  readonly salePrice = 3.86;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) {}

  private orders: OrderEntity[] = [
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

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Calculate total amount to receive
    let montoRecibir;
    if (createOrderDto.tipoCambio === 'compra') {
      montoRecibir = createOrderDto.montoEnviar * this.purchasePrice;
    } else if (createOrderDto.tipoCambio === 'venta') {
      montoRecibir = createOrderDto.montoEnviar / this.salePrice;
    } else {
      throw new Error('Invalid tipo_cambio value');
    }

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      montoRecibir,
    });

    return (await createdOrder.save()).toJSON();
  }

  async findAll(query: PaginationQueryDto): Promise<ResponseOrdersDto> {
    const { page, size } = query;
    const orders = await this.orderModel
      .find()
      .skip(page * size)
      .limit(size);

    const totalOrders = await this.orderModel.countDocuments();
    
    return {
      orders,
      totalOrders,
      pageNumber: page,
      pageSize: size,
    };
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
