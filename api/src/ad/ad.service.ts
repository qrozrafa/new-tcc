/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UserAdService } from 'src/user-ad/user-ad.service';
import { UpdateAdDto } from './dto/update-ad.dto';

@Injectable()
export class AdService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userAdService: UserAdService,
  ) {}

  async createAd(createAdDto: CreateAdDto) {
    const { userId, subjectId, ...adData } = createAdDto;

    if (createAdDto.hourEnd <= createAdDto.hourStart) {
      throw new BadRequestException('Invalid time');
    }

    const existAd = await this.prismaService.userAd.count({
      where: {
        userId: userId,
        nameAd: createAdDto.name,
      },
    });

    if (existAd) {
      throw new BadRequestException('Anúncio ja existe');
    }

    const userAd = await this.prismaService.$transaction(async (prisma) => {
      const ad = await prisma.ad.create({ data: adData });

      const userAdData = {
        userId,
        adId: ad.id,
        subjectId,
        nameAd: adData.name,
      };

      await this.userAdService.createUserAd(userAdData, prisma);

      return ad;
    });

    return userAd;
  }

  async listAdsActive() {
    const ad = await this.prismaService.ad.findMany({
      where: {
        status: 'ACTIVE',
      },
    });

    return ad;
  }

  async listAdsInactive() {
    return await this.prismaService.ad.findMany({
      where: {
        status: 'INACTIVE',
      },
    });
  }

  async listAdsDeleted() {
    return await this.prismaService.ad.findMany({
      where: {
        status: 'DELETED',
      },
    });
  }

  async getAdById(id: string) {
    await this.exists(id);
    return await this.prismaService.ad.findUnique({
      where: {
        id,
      },
    });
  }

  async getAdsByUserId(userId: any) {
    const ads = await this.prismaService.ad.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
    const userAd = await this.prismaService.userAd.findMany({
      where: {
        userId: userId.id,
        status: 'ACTIVE',
      },
    });

    const listUserAds = userAd.map((ad) => {
      const userAds = ads.find((userAd) => userAd.id === ad.adId);
      return { ...ad, ...userAds };
    });

    return listUserAds;
  }

  async deleteAd(id: any) {
    const userAd = await this.prismaService.userAd.findFirst({
      where: {
        adId: id.id,
      },
    });

    const editedAd = await this.prismaService.$transaction(async (prisma) => {
      const ad = await prisma.ad.update({
        where: {
          id: id.id,
        },
        data: {
          deletedAt: new Date(),
          status: 'DELETED',
        },
      });

      await this.userAdService.inactivateUserAd(userAd.adId, prisma);
      return ad;
    });

    return editedAd;
  }

  async inactiveAd(id: string, body: UpdateAdDto) {
    await this.exists(id);

    const editedAd = await this.prismaService.$transaction(async (prisma) => {
      const ad = await prisma.ad.update({
        where: {
          id,
        },
        data: {
          status: 'INACTIVE',
        },
      });

      await this.userAdService.inactivateUserAd(body.subjectId, prisma);
      return ad;
    });

    return editedAd;
  }

  async restoreAd(id: string, body: UpdateAdDto) {
    await this.exists(id);

    const editedAd = await this.prismaService.$transaction(async (prisma) => {
      const ad = await prisma.ad.update({
        where: {
          id,
        },
        data: {
          status: 'ACTIVE',
        },
      });

      await this.userAdService.restoreUserAd(body.subjectId, prisma);
      return ad;
    });

    return editedAd;
  }

  async updateAd(id: any, data: CreateAdDto) {
    await this.exists(id.id);
    const { userId, subjectId, ...adData } = data;
    return await this.prismaService.ad.update({
      where: {
        id: id.id,
      },
      data: adData,
    });
  }

  async updatePartialAd(id: string, data: CreateAdDto) {
    await this.exists(id);
    return await this.prismaService.ad.update({
      where: {
        id,
      },
      data,
    });
  }

  async exists(id: string) {
    if (
      !(await this.prismaService.ad.count({
        where: {
          id,
        },
      }))
    ) {
      throw new BadRequestException(`O anúncio ${id} não existe.`);
    }
  }
}
