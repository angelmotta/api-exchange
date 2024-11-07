import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResponseOrdersDto } from './dto/response-orders.dto';

@Injectable()
export class OrdersService {
  readonly purchasePrice = 3.68;
  readonly salePrice = 3.86;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) {}

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

  async findOne(requestedId: string) {
    // Verify if requestedId is a valid ObjectId
    if (!isValidObjectId(requestedId)) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Requested Order ID ${requestedId} not found`);
    }

    const order = await this.orderModel.findById(requestedId);
    if (!order) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Order with ID ${requestedId} not found`);
    }
    return order;
  }

  async remove(requestedId: string): Promise<void> {
    console.log(`Delete Requested Order ID ${requestedId}`);
    if (!isValidObjectId(requestedId)) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Requested Order ID ${requestedId} not found`);
    }

    const deletedOrder = await this.orderModel.findByIdAndDelete(requestedId);
    if (!deletedOrder) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Order with ID ${requestedId} not found`);
    }
  }
}
