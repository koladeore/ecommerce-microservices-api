import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { UserDto } from './dto/user.dto';

@Controller('user')
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
  async createUser(@Body() userData: UserDto) {
    console.log('User created', userData);
    await this.client.emit('user_created', userData).toPromise();
    return { message: 'User created', user: userData };
  }
}
