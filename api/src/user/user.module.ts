import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { SubjectModule } from 'src/subject/subject.module';
import { AdModule } from 'src/ad/ad.module';
import { CheckUserIdAndRoleMiddleware } from 'src/middlewares/checkUserIdAndRole.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UserAdModule } from 'src/user-ad/user-ad.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => AdModule),
    forwardRef(() => UserAdModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckUserIdAndRoleMiddleware)
      .forRoutes('users/:id', 'users/restore/:id', 'users/reset-password/:id');
  }
}
