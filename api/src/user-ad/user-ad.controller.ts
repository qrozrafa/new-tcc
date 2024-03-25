import { Controller, Get } from '@nestjs/common';
import { UserAdService } from './user-ad.service';

@Controller('usersAds')
export class UserAdController {
  constructor(private readonly userAdService: UserAdService) {}

  @Get()
  async listUserAds() {
    return await this.userAdService.getUsersAds();
  }
  @Get(':subjectId')
  async listSubjectAds(subjectId: string) {
    return await this.userAdService.getSubjectAds(subjectId);
  }
}
