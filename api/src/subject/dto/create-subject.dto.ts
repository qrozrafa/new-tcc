import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @Optional()
  @IsString()
  image: string;
}
