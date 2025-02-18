import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDto } from './dto/location.dto';
import { Location } from './schema/location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<Location>,
  ) {}

  async saveLocation(
    userId: string,
    locationDto: LocationDto,
  ): Promise<Location> {
    console.log(locationDto.coordinates);
    
    const location = await this.locationModel.create({
      userId: userId,
      coordinates: {
        lat: locationDto.coordinates.lat,
        lng: locationDto.coordinates.lng,
      },
      timestamp: locationDto.timestamp,
    });

    return location;
  }
}
