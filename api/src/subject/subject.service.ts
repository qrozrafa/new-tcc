import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}
  async createSubject(data: CreateSubjectDto) {
    return await this.prisma.subject.create({
      data,
    });
  }

  async listSubjects() {
    return await this.prisma.subject.findMany({ where: { status: 'ACTIVE' } });
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

  async updateSubject(id: string, data: CreateSubjectDto) {
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
}
