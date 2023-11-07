import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from '../modules/stores/stores.controller';
import { StoresService } from '../modules/stores/stores.service';
import { CreateStoreDto } from '../modules/stores/stores.dto';
import { MockUserSchema } from '../testHelpers/tests.helper';
import { PaginationInput } from '../base/dto';

describe('StoresController', () => {
  let storesController: StoresController;
  let storesService: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        StoresService,
        {
          provide: StoresService,
          useFactory: () => ({
            fetchUserStores: jest.fn(() => {}),
            fetchUserStoreById: jest.fn(() => {}),
            updateUserStore: jest.fn(() => {}),
            clearStoreProducts: jest.fn(() => {}),
            checkIfStoreExists: jest.fn(() => {}),
            deleteUserStore: jest.fn(() => {}),
            createStore: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    storesController = module.get<StoresController>(StoresController);
    storesService = module.get<StoresService>(StoresService);
  });

  it('should call create method', async () => {
    const request = new CreateStoreDto();
    const user = MockUserSchema;
    expect(
      storesController.create(request, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(storesService.createStore).toHaveBeenCalledWith(request, {
      userId: user._id.toString(),
    });
  });

  it('should call fetch method', async () => {
    const request = new PaginationInput();
    const user = MockUserSchema;
    expect(
      storesController.fetch(request, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(storesService.fetchUserStores).toHaveBeenCalledWith(request, {
      userId: user._id.toString(),
    });
  });

  it('should call fetchById method', async () => {
    const id = '';
    const user = MockUserSchema;
    expect(
      storesController.fetchById(id, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(storesService.fetchUserStoreById).toHaveBeenCalledWith(id, {
      userId: user._id.toString(),
    });
  });

  it('should call update method', async () => {
    const id = '';
    const store = new CreateStoreDto();
    const user = MockUserSchema;
    expect(
      storesController.update(id, store, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(storesService.updateUserStore).toHaveBeenCalledWith(id, store, {
      userId: user._id.toString(),
    });
  });

  it('should call clearStoreProducts method', async () => {
    const id = '';
    const user = MockUserSchema;
    expect(
      storesController.clearStoreProducts(id, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(storesService.clearStoreProducts).toHaveBeenCalledWith(id, {
      userId: user._id.toString(),
    });
  });

  it('should call delete method', async () => {
    const id = '';
    const user = MockUserSchema;
    expect(
      storesController.delete(id, { user: { userId: user._id.toString() } }),
    ).not.toEqual(null);
    expect(storesService.deleteUserStore).toHaveBeenCalledWith(id, {
      userId: user._id.toString(),
    });
  });
});
