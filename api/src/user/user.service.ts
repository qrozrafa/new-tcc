/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import * as bcrypy from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    data.password = await bcrypy.hash(data.password, await bcrypy.genSalt());
    return await this.prisma.user.create({
      data,
    });
  }

  async listUsers() {
    const users = await this.prisma.user.findMany({
      where: { status: 'ACTIVE', role: 'USER' },
    });

    if (users) {
      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return usersWithoutPassword;
    }
  }

  async listUsersAdmin() {
    const users = await this.prisma.user.findMany({
      where: { status: 'ACTIVE', role: 'ADMIN' },
    });

    if (users) {
      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return usersWithoutPassword;
    }
  }

  async listUsersDeleted() {
    return await this.prisma.user.findMany({ where: { status: 'DELETED' } });
  }

  async getUserById(id: string) {
    await this.exists(id);
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }

  async updateUser(id: string, data: UpdatePutUserDto) {
    await this.exists(id);
    data.password = await bcrypy.hash(data.password, await bcrypy.genSalt());
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async updatePartialUser(id: string, data: UpdatePatchUserDto) {
    await this.exists(id);

    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (data.password && data.newPassword) {
      const passwordMatch = await bcrypy.compare(data.password, user.password);

      if (!passwordMatch) {
        throw new Error('Senha atual incorreta');
      }

      const hashedNewPassword = await bcrypy.hash(
        data.newPassword,
        await bcrypy.genSalt(),
      );

      await this.prisma.user.update({
        where: { id: id },
        data: { password: hashedNewPassword },
      });

      return { msg: 'Senha atualizada com sucesso' };
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: string) {
    await this.exists(id);
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    });
  }

  async restoreUser(id: string) {
    await this.exists(id);
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
        status: 'ACTIVE',
      },
    });
  }

  async exists(id: string) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`O usuario ${id} não existe.`);
    }
  }
}
