import { Module, forwardRef } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { UserAdModule } from 'src/user-ad/user-ad.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => UserModule),
    forwardRef(() => UserAdModule),
  ],
  controllers: [AdController],
  providers: [AdService],
  exports: [AdService],
})
export class AdModule {}
