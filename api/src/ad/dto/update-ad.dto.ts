import { IsString } from 'class-validator';

export class UpdateAdDto {
  @IsString()
  subjectId: string;

  @IsString()
  userId: string;
}
