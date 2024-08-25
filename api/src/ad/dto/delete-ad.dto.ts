import { IsString } from 'class-validator';

export class DeleteAdDto {
  @IsString()
  subjectId: string;

  @IsString()
  userId: string;
}
