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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Get()
  async getAllUsers() {
    return this.userService.listUsers();
  }

  @Get('deleted')
  async getAllUsersDeleted() {
    return this.userService.listUsersDeleted();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id) {
    return this.userService.getUserById(id);
  }

  @Put(`:id`)
  async update(@Param('id', ParseUUIDPipe) id, @Body() data: UpdatePutUserDto) {
    return this.userService.updateUser(id, data);
  }

  @Patch(`:id`)
  async partialUpdate(
    @Param('id', ParseUUIDPipe) id,
    @Body() data: UpdatePatchUserDto,
  ) {
    return this.userService.updatePartialUser(id, data);
  }

  @Delete(`:id`)
  async deleteUser(@Param('id', ParseUUIDPipe) id) {
    return this.userService.deleteUser(id);
  }

  @Put(`restore/:id`)
  async restoreUser(@Param('id', ParseUUIDPipe) id) {
    return this.userService.restoreUser(id);
  }
}
