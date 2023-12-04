import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAdDto } from './dto/create-user-ad.dto';

@Injectable()
export class UserAdService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUserAd(
    data: CreateUserAdDto,
    prismaHandler?: any,
  ): Promise<CreateUserAdDto> {
    const prisma = prismaHandler || this.prismaService;
    const userAd: any = {
      subjectId: data.subjectId,
      userId: data.userId,
      adId: data.adId,
      nameAd: data.nameAd,
    };

    return await prisma.userAd.create({ data: userAd });
  }

  async getUsersAds() {
    return await this.prismaService.userAd.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  async deleteUserAd(adId: string, prismaHandler?: any): Promise<any> {
    const prisma = prismaHandler || this.prismaService;
    const userAd = await this.prismaService.userAd.findFirst({
      where: {
        adId: adId,
      },
    });

    await this.exists(userAd.id);

    return await prisma.userAd.update({
      where: {
        id: userAd.id,
      },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });
  }

  async restoreUserAd(adId: string, prismaHandler?: any): Promise<any> {
    const prisma = prismaHandler || this.prismaService;
    const userAd = await this.prismaService.userAd.findFirst({
      where: {
        adId: adId,
      },
    });

    await this.exists(userAd.id);

    return await prisma.userAd.update({
      where: {
        id: userAd.id,
      },
      data: {
        deletedAt: null,
        status: 'ACTIVE',
      },
    });
  }

  async inactivateUserAd(adId: string, prismaHandler?: any): Promise<any> {
    const prisma = prismaHandler || this.prismaService;
    const userAd = await this.prismaService.userAd.findFirst({
      where: {
        adId: adId,
      },
    });

    await this.exists(userAd.id);

    return await prisma.userAd.update({
      where: {
        id: userAd.id,
      },
      data: {
        status: 'INACTIVE',
      },
    });
  }

  async exists(id: string) {
    if (
      !(await this.prismaService.userAd.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O anuncio do usuario não existe.`);
    }
  }
}
