import { Controller } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { OrderDto } from './dto/order.dto';

@Controller()
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

  @EventPattern('order_created')
  handleOrder(@Payload() data: OrderDto) {
    console.log('Processing payment for:', data);

    const paymentResponse = {
      orderId: data.id,
      userEmail: data.userEmail,
      status: 'success',
      transactionId: 'TXN_' + Math.floor(Math.random() * 1000000),
    };

    this.client.emit('payment_successful', paymentResponse);
  }
}
