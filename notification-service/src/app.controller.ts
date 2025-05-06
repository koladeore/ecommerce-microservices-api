import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @EventPattern('payment_successful')
  handlePaymentNotification(@Payload() data: any) {
    console.log('Send email/notification for payment:', data);
  }
}
