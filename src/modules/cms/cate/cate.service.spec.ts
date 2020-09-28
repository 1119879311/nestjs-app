import { Test, TestingModule } from '@nestjs/testing';
import { CateService } from './cate.service';

describe('CateService', () => {
  let service: CateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CateService],
    }).compile();

    service = module.get<CateService>(CateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
