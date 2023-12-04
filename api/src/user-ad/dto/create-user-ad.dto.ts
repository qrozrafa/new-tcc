import { IsString } from 'class-validator';

export class CreateUserAdDto {
  @IsString()
  subjectId: string;

  @IsString()
  userId: string;

  @IsString()
  adId: string;

  @IsString()
  nameAd: string;
}
