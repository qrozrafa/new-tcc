import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return await this.prisma.user.create({
      data,
    });
  }

  async listUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateUser(id: string, data: UpdatePutUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async updatePartialUser(id: string, data: UpdatePatchUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        delete_at: new Date(),
        status: 'DELETED',
      },
    });
  }
}
