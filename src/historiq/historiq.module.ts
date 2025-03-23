import { Module } from '@nestjs/common';
import { HistoriqService } from './historiq.service';
import { HistoriqController } from './historiq.controller';
import { HistoriqSchema } from './schema/historiq.schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Historiq', schema: HistoriqSchema }]),
  ],
  controllers: [HistoriqController],
  providers: [HistoriqService],
})
export class HistoriqModule {}
