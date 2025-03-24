import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHistoriqDto } from './dto/create-historiq.dto';
import { Historiq, HistoriqDocument } from './schema/historiq.schema';

@Injectable()
export class HistoriqService {
  constructor(
    @InjectModel(Historiq.name) private historiqModel: Model<HistoriqDocument>,
  ) {}

  async saveSearch(
    userId: string,
    createHistoriqDto: CreateHistoriqDto,
  ): Promise<Historiq> {
    const { searchedUserId, latitude, longitude } = createHistoriqDto;
    const existingHistoriq = await this.historiqModel.findOne({
      userId,
      searchedUserId,
      latitude,
      longitude,
    });

    if (existingHistoriq) {
      await this.historiqModel.findByIdAndUpdate(
        existingHistoriq._id,
        { updatedAt: new Date() },
        { new: true },
      );
    }
    return await this.historiqModel.create({
      userId,
      searchedUserId,
      latitude,
      longitude,
    });
  }

  async getUserHistory(userId: string): Promise<any[]> {
    return this.historiqModel
      .find({ userId })
      .populate('searchedUserId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
