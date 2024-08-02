import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { join } from 'path';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getUsers() {
    return this.userService.listUsers();
  }

  @Roles(Role.ADMIN)
  @Get('all')
  async getAllUsers() {
    return this.userService.listAllUsers();
  }

  @Roles(Role.ADMIN)
  @Get('admins')
  async getAllUsersAdmin() {
    return this.userService.listUsersAdmin();
  }

  @Roles(Role.ADMIN)
  @Get('deleted')
  async getAllUsersDeleted() {
    return this.userService.listUsersDeleted();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id) {
    return this.userService.getUserById(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(`:id`)
  async update(@Param('id', ParseUUIDPipe) id, @Body() data: UpdatePutUserDto) {
    return this.userService.updateUser(id, data);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(`:id`)
  async partialUpdate(
    @Param('id', ParseUUIDPipe) id,
    @Body() data: UpdatePatchUserDto,
  ) {
    return this.userService.updatePartialUser(id, data);
  }

  @Patch(`reset-password/:id`)
  async resetPassword(
    @Param('id', ParseUUIDPipe) id,
    @Body() data: UpdatePatchUserDto,
  ) {
    return this.userService.resetPasswordUser(id, data);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(`:id`)
  async deleteUser(@Param('id', ParseUUIDPipe) id) {
    return this.userService.deleteUser(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(`restore/:id`)
  async restoreUser(@Param('id', ParseUUIDPipe) id) {
    return this.userService.restoreUser(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post('image/:id')
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.userService.getUserById(id);
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'user',
      `image-${id}.png`,
    );

    try {
      await this.fileService.uploadFile(file, path);
      await this.userService.updatePartialUser(id, {
        name: user.name,
        image: `image-${id}.png`,
      });
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete('image/:id')
  async deleteImage(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.getUserById(id);
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'user',
      `image-${id}.png`,
    );

    try {
      await this.fileService.deleteFile(path);
      await this.userService.updatePartialUser(id, {
        name: user.name,
        image: null,
      });
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
