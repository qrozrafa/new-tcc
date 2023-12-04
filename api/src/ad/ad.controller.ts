import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { DeleteAdDto } from './dto/delete-ad.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(AuthGuard, RoleGuard)
@Controller('ads')
@Roles(Role.ADMIN, Role.USER)
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  async createAd(@Body() body: CreateAdDto) {
    return this.adService.createAd(body);
  }

  @Get()
  async listAds() {
    return this.adService.listAdsAcive();
  }

  @Get(':id')
  async getAdById(id: string) {
    return this.adService.getAdById(id);
  }

  @Delete(':id')
  async deleteAd(@Param() id: string, @Body() body: DeleteAdDto) {
    return this.adService.deleteAd(id, body);
  }

  @Patch('/restore/:id')
  async restoreAd(@Param() id: string, @Body() body: DeleteAdDto) {
    return this.adService.restoreAd(id, body);
  }

  @Put(':id')
  async updateAd(id: string, data: CreateAdDto) {
    return this.adService.updateAd(id, data);
  }
}
