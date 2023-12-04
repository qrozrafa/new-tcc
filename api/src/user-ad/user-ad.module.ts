import { Module, forwardRef } from '@nestjs/common';
import { UserAdService } from './user-ad.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdModule } from 'src/ad/ad.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserAdController } from './user-ad.controller';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AdModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserAdController],
  providers: [UserAdService],
  exports: [UserAdService],
})
export class UserAdModule {}
