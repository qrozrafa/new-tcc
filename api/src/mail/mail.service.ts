import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async sendMailForget(to: string) {
    const user = await this.userService.getUserByEmail(to);

    const tokenUser = await this.authService.createToken(user);

    const mailOptions = {
      from: process.env.EMAIL_GOOGLE,
      to,
      subject: 'Recuperação de senha',
      template: './forgot',
      context: {
        name: user.name,
        logoUrl: 'https://iili.io/dxJF4Y7.png',
        resetLink: `http://localhost:3000/reset?token=${tokenUser.access_token}`,
      },
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      return 'Email enviado com sucesso';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
