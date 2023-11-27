import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createToken(email: string, password: string) {
    const payload = { email, password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async checkToken(token: string) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async forget(email: string) {
    const user = this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email não encontrado');
    }

    // TODO: Implementar envio de email

    return true;
  }

  async reset(password: string, token: string) {
    // TODO: Implementar verificação de token
    const user = {
      where: {
        token,
      },
    };

    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    const id = '1';

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return true;
  }
}
