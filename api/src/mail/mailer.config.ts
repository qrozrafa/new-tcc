import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

export const mailerConfig: MailerAsyncOptions = {
  useFactory: () => ({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'nao.responda.duo.study@gmail.com',
        pass: 'vbac tjxj scbv gaat',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@localhost>',
    },
    preview: true,
    template: {
      dir: process.cwd() + '/src/mail/template',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
};
