import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.contoller';
import { SubjectModule } from 'src/subject/subject.module';
import { UserAdModule } from 'src/user-ad/user-ad.module';
import { AdModule } from 'src/ad/ad.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PrismaModule,
    forwardRef(() => UserModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => UserAdModule),
    forwardRef(() => AdModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
