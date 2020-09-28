import { Test, TestingModule } from '@nestjs/testing';
import { CateController } from './cate.controller';

describe('CateController', () => {
  let controller: CateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CateController],
    }).compile();

    controller = module.get<CateController>(CateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
