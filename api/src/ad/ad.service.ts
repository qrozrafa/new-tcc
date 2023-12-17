import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UserAdService } from 'src/user-ad/user-ad.service';
import { DeleteAdDto } from './dto/delete-ad.dto';
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

  async listAdsAcive() {
    return await this.prismaService.ad.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
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

  async deleteAd(id: string, body: DeleteAdDto) {
    await this.exists(id);

    const editedAd = await this.prismaService.$transaction(async (prisma) => {
      const ad = await prisma.ad.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          status: 'DELETED',
        },
      });

      await this.userAdService.inactivateUserAd(body.subjectId, prisma);
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

  async updateAd(id: string, data: CreateAdDto) {
    await this.exists(id);
    return await this.prismaService.ad.update({
      where: {
        id,
      },
      data,
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