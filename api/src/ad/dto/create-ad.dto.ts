import { IsString, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { WeekDay } from 'src/enums/week-day.enum';

export class CreateAdDto {
  @IsString()
  userId: string;

  @IsString()
  subjectId: string;

  @IsString()
  name: string;

  @IsEnum(WeekDay, { each: true })
  weekDay: WeekDay[];

  @IsDateString()
  hourStart: Date;

  @IsDateString()
  hourEnd: Date;

  @IsBoolean()
  useVoice: boolean;

  @IsBoolean()
  useVideo: boolean;
}
