import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HistoriqService } from './historiq.service';
import mongoose, { Model } from 'mongoose';
import { Historiq } from './schema/historiq.schema';

const mockHistoriq = {
  _id: new mongoose.Types.ObjectId(),
  userId: 'user123',
  searchedUserId: 'searchedUser456',
  latitude: 10.1234,
  longitude: 20.5678,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  save: jest.fn().mockResolvedValue(this),
};

describe('HistoriqService', () => {
  let service: HistoriqService;
  let model: Model<Historiq>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoriqService,
        {
          provide: getModelToken('Historiq'),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockHistoriq),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockHistoriq),
            find: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnThis(),
              sort: jest.fn().mockReturnThis(),
              lean: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue([mockHistoriq]),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<HistoriqService>(HistoriqService);
    model = module.get<Model<Historiq>>(getModelToken('Historiq'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveSearch', () => {
    it('should create history entry', async () => {
      const existingHistoriq = {
        ...mockHistoriq,
        save: jest.fn().mockResolvedValue(mockHistoriq),
      };
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(existingHistoriq);
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(mockHistoriq);

      const result = await service.saveSearch('user123', {
        searchedUserId: 'searchedUser456',
        latitude: 10.1234,
        longitude: 20.5678,
      });

      expect(result).toEqual(mockHistoriq);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockHistoriq._id,
        { updatedAt: expect.any(Date) },
        { new: true },
      );
    });

    it('should update the existing history entry', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockHistoriq);
      jest
        .spyOn(model, 'findByIdAndUpdate')
        .mockResolvedValueOnce(mockHistoriq);

      const result = await service.saveSearch('user123', {
        searchedUserId: 'searchedUser456',
        latitude: 10.1234,
        longitude: 20.5678,
      });

      expect(result).toEqual(mockHistoriq);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockHistoriq._id,
        { updatedAt: expect.any(Date) },
        { new: true },
      );
    });
  });

  describe('getUserHistory', () => {
    it('should return user search history', async () => {
      const result = await service.getUserHistory('user123');

      expect(result).toEqual([mockHistoriq]);
      expect(model.find).toHaveBeenCalledWith({ userId: 'user123' });
    });
  });
});
