import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/register-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  private audience = 'users';
  private issuer = 'auth';
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User): Promise<any> {
    if (user.status === 'DELETED') {
      throw new UnauthorizedException('Usuário não existe');
    }
    return {
      access_token: this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        {
          expiresIn: '7d',
          subject: user.id,
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user.status === 'DELETED') {
      throw new UnauthorizedException('Usuário não existe');
    }

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.createToken(user);
  }

  async forget(email: string) {
    const user = this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user || (await user).status === 'DELETED') {
      throw new UnauthorizedException('Email não encontrado');
    }

    // TODO: Implementar envio de email

    return true;
  }

  async reset(password: string, token: string) {
    // TODO: Implementar verificação de token

    const tokenAccess = token;
    const id = '1';

    console.log(tokenAccess);

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.createUser(data);

    return this.createToken(user);
  }
}
