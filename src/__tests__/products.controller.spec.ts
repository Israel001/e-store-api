import { Test, TestingModule } from '@nestjs/testing';
import { MockUserSchema } from '../testHelpers/tests.helper';
import { ProductsService } from '../modules/products/products.service';
import { ProductsController } from '../modules/products/products.controller';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../modules/products/products.dto';
import { PaginationInput } from '../base/dto';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: ProductsService,
          useFactory: () => ({
            createProduct: jest.fn(() => {}),
            fetchAllProducts: jest.fn(() => {}),
            fetchProductById: jest.fn(() => {}),
            updateProduct: jest.fn(() => {}),
            deleteProduct: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should call create method', async () => {
    const request = new CreateProductDto();
    const user = MockUserSchema;
    expect(
      productsController.create(request, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(productsService.createProduct).toHaveBeenCalledWith(request, {
      userId: user._id.toString(),
    });
  });

  it('should call fetch method', async () => {
    const request = new PaginationInput();
    expect(productsController.fetch(request)).not.toEqual(null);
    expect(productsService.fetchAllProducts).toHaveBeenCalledWith(request);
  });

  it('should call fetchById method', async () => {
    const id = '';
    expect(productsController.fetchById(id)).not.toEqual(null);
    expect(productsService.fetchProductById).toHaveBeenCalledWith(id);
  });

  it('should call update method', async () => {
    const id = '';
    const product = new UpdateProductDto();
    const user = MockUserSchema;
    expect(
      productsController.update(id, product, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(productsService.updateProduct).toHaveBeenCalledWith(id, product, {
      userId: user._id.toString(),
    });
  });

  it('should call delete method', async () => {
    const id = '';
    const user = MockUserSchema;
    expect(
      productsController.delete(id, {
        user: { userId: user._id.toString() },
      }),
    ).not.toEqual(null);
    expect(productsService.deleteProduct).toHaveBeenCalledWith(id, {
      userId: user._id.toString(),
    });
  });
});
