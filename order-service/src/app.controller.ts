import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class AppController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@rabbitmq:5672'],
      },
    });
  }
  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
  @Post()
  async createOrder(@Body() orderData: OrderDto) {
    console.log('Order received', orderData);
    await this.client.emit('order_created', orderData).toPromise();
    return { message: 'Order created', order: orderData };
  }
}
