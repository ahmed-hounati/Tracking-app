import { Test, TestingModule } from '@nestjs/testing';
import { HistoriqService } from './historiq.service';

describe('HistoriqService', () => {
  let service: HistoriqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoriqService],
    }).compile();

    service = module.get<HistoriqService>(HistoriqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
