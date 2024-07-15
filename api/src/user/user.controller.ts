import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
