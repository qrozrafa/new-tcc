import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAdService } from 'src/user-ad/user-ad.service';
import { UserService } from 'src/user/user.service';
import { AdService } from 'src/ad/ad.service';
import { UpdateSubjectDTO } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userAdService: UserAdService,
    private readonly userService: UserService,
    private readonly adService: AdService,
  ) {}
  async createSubject(data: CreateSubjectDto) {
    console.log(data);
    return await this.prisma.subject.create({
      data,
    });
  }

  async listSubjects() {
    const subjects = (
      await this.prisma.subject.findMany({
        where: { status: 'ACTIVE' },
      })
    ).sort((a, b) => a.name.localeCompare(b.name));

    if (subjects.length) {
      const subjectAdsWhithCount = await Promise.all(
        subjects.map(async (subject) => {
          const subjectAd = await this.userAdService.getSubjectAds(subject.id);

          const activeSubjectAd = await Promise.all(
            subjectAd.map(async (ad) => {
              const user = await this.userService.getUserById(ad.userId);
              return user && user.status === 'ACTIVE' ? ad : null;
            }),
          );

          const countAds = activeSubjectAd.filter(Boolean).length;

          return {
            ...subject,
            countAds,
          };
        }),
      );
      return subjectAdsWhithCount;
    }
    return [];
  }

  async listAllSubjects() {
    const subjects = (await this.prisma.subject.findMany()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    if (subjects.length) {
      const subjectAdsWhithCount = await Promise.all(
        subjects.map(async (subject) => {
          const subjectAd = await this.userAdService.getSubjectAds(subject.id);

          const activeSubjectAd = await Promise.all(
            subjectAd.map(async (ad) => {
              const user = await this.userService.getUserById(ad.userId);
              return user && user.status === 'ACTIVE' ? ad : null;
            }),
          );

          const countAds = activeSubjectAd.filter(Boolean).length;

          return {
            ...subject,
            countAds,
          };
        }),
      );
      return subjectAdsWhithCount;
    }
    return [];
  }

  async listSubjectAds(subjectId: string) {
    const subjectAds = await this.userAdService.getSubjectAds(subjectId);

    if (subjectAds) {
      const detailsUserAndAds = (
        await Promise.all(
          subjectAds.map(async (subjectAd) => {
            const detailUser = await this.userService.getUserById(
              subjectAd.userId,
            );
            const detailAd = await this.adService.getAdById(subjectAd.adId);

            if (!detailUser || detailUser.status !== 'ACTIVE') {
              return null;
            }

            const { name: nameUser, id } = detailUser;
            return {
              nameUser,
              userId: id,
              ...subjectAd,
              ...detailAd,
            };
          }),
        )
      )
        .filter(Boolean)
        .sort((a, b) => {
          if (a.createdAt < b.createdAt) return 1;
          if (a.createdAt > b.createdAt) return -1;
          return 0;
        });

      return detailsUserAndAds;
    }

    return [];
  }

  async listLastSubjectAds(subjectId: string) {
    const subjectAds = await this.userAdService.getSubjectAds(subjectId);

    if (subjectAds) {
      const detailsUserAndAds = (
        await Promise.all(
          subjectAds.map(async (subjectAd) => {
            const detailUser = await this.userService.getUserById(
              subjectAd.userId,
            );
            const detailAd = await this.adService.getAdById(subjectAd.adId);

            const { name: nameUser, id } = detailUser;
            return {
              nameUser,
              userId: id,
              ...subjectAd,
              ...detailAd,
            };
          }),
        )
      ).sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });

      return detailsUserAndAds;
    }
  }

  async listSubjectDeleted() {
    return await this.prisma.subject.findMany({ where: { status: 'DELETED' } });
  }

  async restoreSubject(id: string) {
    await this.exists(id);
    return await this.prisma.subject.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
        status: 'ACTIVE',
      },
    });
  }

  async deleteSubject(id: string) {
    await this.exists(id);
    return await this.prisma.subject.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });
  }

  async getSubjectById(id: string) {
    await this.exists(id);
    const subject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    });

    return subject;
  }

  async updateSubject(id: string, data: UpdateSubjectDTO) {
    await this.exists(id);
    return await this.prisma.subject.update({
      where: {
        id,
      },
      data,
    });
  }

  async exists(id: string) {
    if (
      !(await this.prisma.subject.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`A matéria ${id} não existe.`);
    }
  }

  async getAllAdsByAllUsersEndSubjects() {
    const listUsersAds = await this.userAdService.getUsersAds();

    const fitUsersAds = listUsersAds.map((userAd) => ({
      ...userAd,
      userAdId: userAd.id,
    }));

    if (fitUsersAds.length > 0) {
      const listUsers = await this.prisma.user.findMany({
        where: { status: 'ACTIVE' },
      });

      const fitUsers = listUsers.map((user) => ({
        ...user,
        nameUser: user.name,
      }));

      const listAds = await this.prisma.ad.findMany({
        where: { status: 'ACTIVE' },
      });

      const ads = fitUsersAds
        .map((userAd) => {
          const ad = listAds.find((ad) => ad.id === userAd.adId);
          return ad ? { ...userAd, ...ad } : null;
        })
        .filter(Boolean);

      const listSubjects = await this.prisma.subject.findMany({
        where: { status: 'ACTIVE' },
      });

      const subjects = ads
        .map((ad) => {
          const subject = listSubjects.find(
            (subject) => subject.id === ad.subjectId,
          );
          return subject ? { ...ad, subjectName: subject.name } : null;
        })
        .filter(Boolean);

      return subjects
        .map((subject) => {
          const user = fitUsers.find((user) => user.id === subject.userId);
          return user ? { ...subject, nameUser: user.nameUser } : null;
        })
        .filter(Boolean)
        .sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
        );
    }
    return [];
  }

  async getAllLastAdsByAllUsersEndSubjects() {
    const listUsersAds = await this.userAdService.getUsersAds();

    const fitUsersAds = listUsersAds.map((userAd) => ({
      ...userAd,
      userAdId: userAd.id,
    }));

    if (fitUsersAds.length > 0) {
      const listUsers = await this.prisma.user.findMany({
        where: { status: 'ACTIVE' },
      });

      const fitUsers = listUsers.map((user) => ({
        ...user,
        nameUser: user.name,
      }));

      const listAds = await this.prisma.ad.findMany({
        where: { status: 'ACTIVE' },
      });

      const ads = fitUsersAds
        .map((userAd) => {
          const ad = listAds.find((ad) => ad.id === userAd.adId);
          return ad ? { ...userAd, ...ad } : null;
        })
        .filter(Boolean);

      const listSubjects = await this.prisma.subject.findMany({
        where: { status: 'ACTIVE' },
      });

      const subjects = ads
        .map((ad) => {
          const subject = listSubjects.find(
            (subject) => subject.id === ad.subjectId,
          );
          return subject ? { ...ad, subjectName: subject.name } : null;
        })
        .filter(Boolean);

      return subjects
        .map((subject) => {
          const user = fitUsers.find((user) => user.id === subject.userId);
          return user ? { ...subject, nameUser: user.nameUser } : null;
        })
        .filter(Boolean)
        .sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
        );
    }
    return [];
  }
}
