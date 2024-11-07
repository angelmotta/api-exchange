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

    // Construct the URL of the created order (Location: http header)
    const protocol = request.protocol;
    const host = request.get('host');
    const locationUrlNewOrder = `${protocol}://${host}/api/v1.1/orders/${createdOrder.id}`;

    response.status(201).location(locationUrlNewOrder).json(createdOrder);
  }

  // Get all orders paginated
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() response: Response) {
    const wasDeleted = this.ordersService.remove(id);
    if (!wasDeleted) {
      // HTTP status code 404 (Not Found)
      response.status(404).json({ message: `Order with id ${id} not found` });
      return;
    }
    // return 204
    response.status(204).send();
  }
}
