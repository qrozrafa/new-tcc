import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDTO } from './dto/update-subject.dto';
import { join } from 'path';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() data: CreateSubjectDto) {
    return this.subjectService.createSubject(data);
  }

  @Get()
  async getSubjectsActive() {
    return this.subjectService.listSubjects();
  }
  @Get('all')
  async getAllSubjects() {
    return this.subjectService.listAllSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.getSubjectById(id);
  }
  @Get('ads/:id')
  async getSubjectAds(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.listSubjectAds(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateSubject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateSubjectDTO,
  ) {
    return this.subjectService.updateSubject(id, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.deleteSubject(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Put('restore/:id')
  async restoreSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.restoreSubject(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('all/ads')
  async getAllAdsByAllUsersEndSubjects() {
    return this.subjectService.getAllAdsByAllUsersEndSubjects();
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post('image/:id')
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const subject = await this.subjectService.getSubjectById(id);
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'subject',
      `image-${id}.png`,
    );

    try {
      await this.fileService.uploadFile(file, path);
      await this.subjectService.updateSubject(id, {
        name: subject.name,
        image: `image-${id}.png`,
      });
      return { msg: 'Imagem alterada com sucesso' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete('image/:id')
  async deleteImage(@Param('id', ParseUUIDPipe) id: string) {
    const subject = await this.subjectService.getSubjectById(id);
    const path = join(
      __dirname,
      '..',
      '..',
      'storage',
      'subject',
      `image-${id}.png`,
    );

    try {
      await this.fileService.deleteFile(path);
      await this.subjectService.updateSubject(id, {
        name: subject.name,
        image: null,
      });
      return { msg: 'Imagem deletada com sucesso' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
