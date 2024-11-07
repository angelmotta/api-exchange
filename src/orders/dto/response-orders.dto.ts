import { Order } from '../schemas/order.schema';
export class ResponseOrdersDto {
  orders: Order[];
  totalOrders: number;
  pageNumber: number;
  pageSize: number;
}
