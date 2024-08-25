import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { AdModule } from './ad/ad.module';
import { UserAdModule } from './user-ad/user-ad.module';
import { MailModule } from './mail/mail.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => AdModule),
    forwardRef(() => UserAdModule),
    MailModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
      serveRoot: '/storage',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
