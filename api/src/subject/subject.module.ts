import { Module, forwardRef } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AdModule } from 'src/ad/ad.module';
import { UserAdModule } from 'src/user-ad/user-ad.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => AdModule),
    forwardRef(() => UserAdModule),
    forwardRef(() => FileModule),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
