import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDTO } from './dto/update-subject.dto';

@UseGuards(AuthGuard, RoleGuard)
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() data: CreateSubjectDto) {
    return this.subjectService.createSubject(data);
  }

  @Get()
  async getAllSubjects() {
    return this.subjectService.listSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.getSubjectById(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async updateSubject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateSubjectDTO,
  ) {
    return this.subjectService.updateSubject(id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.deleteSubject(id);
  }

  @Roles(Role.ADMIN)
  @Put('restore/:id')
  async restoreSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectService.restoreSubject(id);
  }
}
