import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { LocationDto } from './dto/location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(AuthGuard)
  async updateLocation(@Request() req, @Body() locationDto: LocationDto) {
    return this.locationService.saveLocation(req.user.id, locationDto);
  }
}
