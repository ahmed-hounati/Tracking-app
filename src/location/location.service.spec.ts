import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LocationService } from './location.service';
import { Model } from 'mongoose';
import { Location } from './schema/location.schema';

const mockLocation = {
  _id: '60c72b2f9b1d8b3a3c1f9e1d',
  userId: 'user123',
  longitude: 10.1234,
  latitude: 20.5678,
  timestamp: new Date(),
  __v: 0,
  save: jest.fn().mockResolvedValue(this),
};

describe('LocationService', () => {
  let service: LocationService;
  let model: Model<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken('Location'),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockLocation),
          },
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    model = module.get<Model<Location>>(getModelToken('Location'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveLocation', () => {
    it('should update an existing location', async () => {
      const existingLocation = {
        ...mockLocation,
        save: jest.fn().mockResolvedValue(mockLocation),
      };
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(existingLocation);

      const result = await service.saveLocation('user123', {
        longitude: 11.1234,
        latitude: 21.5678,
        timestamp: 2002,
      });

      expect(result).toEqual(mockLocation);
      expect(existingLocation.save).toHaveBeenCalled();
    });

    it('should update an existing location', async () => {
      const existingLocation = {
        ...mockLocation,
        save: jest.fn().mockResolvedValue(mockLocation),
      };
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(existingLocation);

      const result = await service.saveLocation('user123', {
        longitude: 11.1234,
        latitude: 21.5678,
        timestamp: 2000,
      });

      expect(result).toEqual(mockLocation);
      expect(existingLocation.save).toHaveBeenCalled();
    });
  });

  describe('getLocationByUserId', () => {
    it('should return a location for a valid userId', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockLocation);

      const result = await service.getLocationByUserId('user123');
      expect(result).toEqual(mockLocation);
      expect(model.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    });
  });
});
