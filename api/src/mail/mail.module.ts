import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './mailer.config';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    MailerModule.forRootAsync(mailerConfig),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  exports: [MailerModule],
})
export class MailModule {}
