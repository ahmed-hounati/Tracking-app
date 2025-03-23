import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqController } from './historiq.controller';
import { HistoriqService } from './historiq.service';

describe('HistoriqController', () => {
  let controller: HistoriqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoriqController],
      providers: [HistoriqService],
    }).compile();

    controller = module.get<HistoriqController>(HistoriqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
