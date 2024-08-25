import { Module, forwardRef } from '@nestjs/common';
import { UserAdService } from './user-ad.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserAdController } from './user-ad.controller';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { AdModule } from 'src/ad/ad.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => AdModule),
  ],
  controllers: [UserAdController],
  providers: [UserAdService],
  exports: [UserAdService],
})
export class UserAdModule {}
