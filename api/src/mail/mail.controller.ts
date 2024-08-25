import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('forgot')
  async sendEmailForget(@Body() emailData: { to: string }) {
    return await this.mailService.sendMailForget(emailData.to);
  }
}
