import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ResponseOrdersDto } from './dto/response-orders.dto';
import { RatesService } from 'src/rates/rates.service';
import { CreatedOrderResponseDto } from './dto/created-order-response.dto';

@Injectable()
export class OrdersService {
  readonly currencyPair = 'USDPEN';

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly ratesService: RatesService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<CreatedOrderResponseDto> {
    // Calculate total amount to receive
    // Use the rates service to search by currencyPair ("USDPEN")
    const rate = await this.ratesService.findByCurrencyPair(this.currencyPair);
    // Check if rate is found
    if (!rate) {
      // return HTTP 404 Not Found response
      throw new NotFoundException(`Rate with currency pair ${this.currencyPair} not found (Create Rate first)`);
    }

    // Calculate total amount to receive  
    let montoRecibir;
    if (createOrderDto.tipoCambio === 'compra') {
      montoRecibir = createOrderDto.montoEnviar * rate.purchasePrice;
    } else if (createOrderDto.tipoCambio === 'venta') {
      montoRecibir = createOrderDto.montoEnviar / rate.salePrice;
    } else {
      // return HTTP 400 Bad Request response (Should not happen)
      throw new BadRequestException('Requested tipoCambio is not valid');
    }
    // Create new order Object
    const newOrder = new this.orderModel({
      ...createOrderDto,
      montoRecibir,
      rate: rate.toJSON(),
    });
    // Save order to database
    const savedOrder = await newOrder.save();
    
    // const savedOrder = (await newOrder.save()).toJSON();
    // Return CreatedOrderResponseDto object
    return {
      id: savedOrder.id,
      tipoCambio: savedOrder.tipoCambio,
      montoEnviar: savedOrder.montoEnviar,
      montoRecibir: savedOrder.montoRecibir,
      rate: {
        id: rate.id,
        currencyPair: rate.currencyPair,
        purchasePrice: rate.purchasePrice,
        salePrice: rate.salePrice,
        createdAt: rate.toJSON().createdAt,
        updatedAt: rate.toJSON().updatedAt,
      },
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
    };
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
