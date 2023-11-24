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

@Controller('users')
export class UserController {
  constructor() {}

  @Post()
  async createUser(@Body() { name, email, password, cpf, ra }: CreateUserDto) {
    return { name, email, password, cpf, ra };
  }

  @Get()
  async getAllUsers() {
    return {
      users: [],
    };
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id) {
    return {
      user: {},
      id,
    };
  }

  @Put(`:id`)
  async updateUser(
    @Param('id', ParseUUIDPipe) id,
    @Body() { name, email, password, cpf, ra }: UpdatePutUserDto,
  ) {
    return {
      method: 'PUT',
      name,
      email,
      password,
      cpf,
      ra,
    };
  }

  @Patch(`:id`)
  async partialUpdateUser(
    @Param('id', ParseUUIDPipe) id,
    @Body() { name, email, password, cpf, ra }: UpdatePatchUserDto,
  ) {
    return {
      method: 'PATCH',
      name,
      email,
      password,
      cpf,
      ra,
    };
  }

  @Delete(`:id`)
  async deleteUser(@Param('id', ParseUUIDPipe) id) {
    return {
      method: 'DELETE',
      id,
    };
  }
}
