import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request, Response } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { log } from 'console';

@Controller('/api/v1.1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const createdOrder = await this.ordersService.create(createOrderDto);
    
    // Order created and stored in DB
    // Include URL of new order Http header Location and return response
    const protocol = request.protocol;
    const host = request.get('host');
    const locationUrlNewOrder = `${protocol}://${host}/api/v1.1/orders/${createdOrder.id}`;

    response.status(201).location(locationUrlNewOrder).json(createdOrder);
  }

  // Get all orders paginated
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    await this.ordersService.remove(id);
    // return HTTP 204 No Content response if delete operation is successful
    response.status(204).send();
  }
}
