import {
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { LocationDto } from './dto/location.dto';
import { JwtService } from '@nestjs/jwt';
import { Location } from './schema/location.schema';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  async getLocationByUserId(@Param('id') id: string): Promise<any> {
    const location = await this.locationService.getLocationByUserId(id);
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return { latitude: location.latitude, longitude: location.longitude };
  }

  @Post()
  @UseGuards(AuthGuard)
  async updateLocation(
    @Headers('authorization') authHeader: string,
    @Body() locationDto: LocationDto,
  ) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Invalid authorization header');
      }

      const token = authHeader.split(' ')[1];
      const decoded: any = this.jwtService.verify(token);

      return this.locationService.saveLocation(decoded.id, locationDto);
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new Error('Unauthorized');
    }
  }
}
