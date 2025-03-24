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
    const existingLocation = await this.locationModel.findOne({ userId });

    if (existingLocation) {
      existingLocation.longitude = locationDto.longitude;
      existingLocation.latitude = locationDto.latitude;
      return await existingLocation.save();
    } else {
      return await this.locationModel.create({
        userId,
        longitude: locationDto.longitude,
        latitude: locationDto.latitude,
        timestamp: locationDto.timestamp,
      });
    }
  }
  async getLocationByUserId(userId: string): Promise<Location | null> {
    return await this.locationModel.findOne({ userId: userId });
  }
}
