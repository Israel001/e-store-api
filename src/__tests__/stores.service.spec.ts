import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from '../modules/stores/stores.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import {
  AuthContext,
  DeleteResult,
  MockPagination,
  MockProductsModel,
  MockStoreSchema,
  MockStoresModel,
  MockUsersModel,
} from '../testHelpers/tests.helper';
import { PaginationInput } from '../base/dto';
import { Store } from '../schemas/store.schema';
import { Product } from '../schemas/product.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from '../modules/stores/stores.dto';

describe('StoresService', () => {
  let storesService: StoresService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getModelToken(Store.name),
          useValue: MockStoresModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: MockUsersModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: MockProductsModel,
        },
      ],
    }).compile();
    storesService = module.get<StoresService>(StoresService);
  });

  describe('FetchUserStores Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      const fetchUserStoresSpy = jest.spyOn(storesService, 'fetchUserStores');
      const pagination = new PaginationInput();
      const result = await storesService.fetchUserStores(
        pagination,
        AuthContext,
      );
      expect(fetchUserStoresSpy).toHaveBeenCalledWith(pagination, AuthContext);
      expect(result).toEqual(MockPagination([]));
    });
  });

  describe('FetchUserStoreById Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw not found exception when store does not exist', async () => {
      const id = '6548fd31bcab8291bf88fdcd';
      await expect(
        storesService.fetchUserStoreById(id, AuthContext),
      ).rejects.toThrow(new NotFoundException('Store not found'));
    });

    it('should return a successful response', async () => {
      MockStoresModel.findOne.mockReturnValue({
        populate: jest.fn(() => {
          return {
            exec: jest.fn(() => MockStoreSchema),
          };
        }),
      });
      const fetchUserStoreByIdSpy = jest.spyOn(
        storesService,
        'fetchUserStoreById',
      );
      const id = '6548fd31bcab8291bf88fdcd';
      const result = await storesService.fetchUserStoreById(id, AuthContext);
      expect(fetchUserStoreByIdSpy).toHaveBeenCalledWith(id, AuthContext);
      expect(result).toEqual(MockStoreSchema);
    });
  });

  describe('UpdateUserStore Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      MockStoresModel.findOne.mockReturnValue({
        save: jest.fn(() => MockStoreSchema),
      });
      MockStoresModel.find.mockReturnValue([]);
      const id = '6548fd31bcab8291bf88fdcd';
      const store = new CreateStoreDto();
      const updateUserStoreSpy = jest.spyOn(storesService, 'updateUserStore');
      const result = await storesService.updateUserStore(
        id,
        store,
        AuthContext,
      );
      expect(updateUserStoreSpy).toHaveBeenCalledWith(id, store, AuthContext);
      expect(result).toEqual(MockStoreSchema);
    });

    it('should throw conflict exception when duplicate store name is provided', async () => {
      MockStoresModel.find.mockReturnValue([MockStoreSchema]);
      const store = new CreateStoreDto();
      const id = '6548fd31bcab8291bf88fdcd';
      await expect(
        storesService.updateUserStore(id, store, AuthContext),
      ).rejects.toThrow(
        new ConflictException(
          `Another store with name: ${store.name} already exists`,
        ),
      );
    });
  });

  describe('ClearStoreProducts Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      MockStoresModel.findOne.mockReturnValue({
        save: jest.fn(() => MockStoreSchema),
      });
      const id = '6548fd31bcab8291bf88fdcd';
      const clearStoreProductsSpy = jest.spyOn(
        storesService,
        'clearStoreProducts',
      );
      const result = await storesService.clearStoreProducts(id, AuthContext);
      expect(clearStoreProductsSpy).toHaveBeenCalledWith(id, AuthContext);
      expect(result).toEqual(MockStoreSchema);
    });
  });

  describe('CheckIfStoreExists Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      MockStoresModel.findOne.mockReturnValue(MockStoreSchema);
      const storeId = '6548fd31bcab8291bf88fdcd';
      const userId = '6548fd31bcab8291bf88fdcd';
      const checkIfStoreExistsSpy = jest.spyOn(
        storesService,
        'checkIfStoreExists',
      );
      const result = await storesService.checkIfStoreExists(storeId, userId);
      expect(checkIfStoreExistsSpy).toHaveBeenCalledWith(storeId, userId);
      expect(result).toEqual(MockStoreSchema);
    });

    it('should throw not found exception when store is not found', async () => {
      MockStoresModel.findOne.mockReturnValue(undefined);
      const storeId = '6548fd31bcab8291bf88fdcd';
      const userId = '6548fd31bcab8291bf88fdcd';
      await expect(
        storesService.checkIfStoreExists(storeId, userId),
      ).rejects.toThrow(new NotFoundException('Store not found'));
    });
  });

  describe('DeleteUserStore Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      MockStoresModel.findOne.mockReturnValue(MockStoreSchema);
      const id = '6548fd31bcab8291bf88fdcd';
      const deleteUserStoreSpy = jest.spyOn(storesService, 'deleteUserStore');
      const result = await storesService.deleteUserStore(id, AuthContext);
      expect(deleteUserStoreSpy).toHaveBeenCalledWith(id, AuthContext);
      expect(result).toEqual(DeleteResult);
    });
  });

  describe('CreateStore Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      MockStoresModel.findOne.mockReturnValue({
        exec: jest.fn(() => undefined),
      });
      const store = new CreateStoreDto();
      const createStoreSpy = jest.spyOn(storesService, 'createStore');
      const result = await storesService.createStore(store, AuthContext);
      expect(createStoreSpy).toHaveBeenCalledWith(store, AuthContext);
      expect(result).toEqual(MockStoreSchema);
    });
  });
});
