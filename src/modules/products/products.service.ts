import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { Store } from 'src/schemas/store.schema';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { IAuthContext } from 'src/types';
import { StoresService } from '../stores/stores.service';
import { DeleteResult } from 'mongodb';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    private readonly storesService: StoresService,
  ) {}

  async fetchAllProducts(pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
    const orderBy = pagination.orderBy || 'createdAt';
    const orderDir = pagination.orderDir || 'desc';
    const products = await this.productModel
      .find({ availability: true }, {}, { skip: limit * (page - 1), limit })
      .sort({ [orderBy]: orderDir })
      .exec();
    return buildResponseDataWithPagination(products, products.length, {
      page,
      limit,
    });
  }

  async fetchProductById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteProduct(
    id: string,
    { userId }: IAuthContext,
  ): Promise<DeleteResult> {
    const productInDb = await this.productModel.findById(id).populate('store');
    if (!productInDb) throw new NotFoundException('Product not found');
    if (!new Types.ObjectId(userId).equals(productInDb.store.user as any))
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    const storeInDb = await this.storeModel.findById(productInDb.store._id);
    storeInDb.products = storeInDb.products.filter(
      (product) => !productInDb._id.equals(product),
    );
    await storeInDb.save();
    return this.productModel
      .deleteOne({
        _id: productInDb._id,
      })
      .exec();
  }

  async updateProduct(
    id: string,
    product: UpdateProductDto,
    { userId }: IAuthContext,
  ) {
    const productInDb = await this.productModel.findById(id).populate('store');
    if (!productInDb) throw new NotFoundException('Product not found');
    if (
      !new Types.ObjectId(userId).equals(
        productInDb.store.user as any as Types.ObjectId,
      )
    ) {
      // Because the `user` is not auto-populated by mongoose, the actual value is returned as an ObjectId,
      // but it points to UserModel type in the entity
      // hence it needs to be casted as an ObjectId for TS to understand
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );
    }
    const duplicateFound = await this.productModel.findOne({
      name: product.name,
      _id: { $ne: id },
    });
    if (duplicateFound)
      throw new ConflictException(
        `Another product with name: ${product.name} already exists`,
      );

    productInDb.name = product.name || productInDb.name;
    productInDb.description = product.description || productInDb.description;
    productInDb.weight = product.weight || productInDb.weight;
    productInDb.category = product.category || productInDb.category;
    productInDb.brand = product.brand || productInDb.brand;

    //  Due to these properties being a number type, we have to explicitly check if their type is undefined,
    //  because using the OR comparison method will result in an unexpected behavior when values like '0' is provided,
    //  and this is because '0' is not a truthy value in js
    if (typeof product.price !== 'undefined') productInDb.price = product.price;
    if (typeof product.quantity !== 'undefined') {
      productInDb.quantity = product.quantity;
      productInDb.availability = product.quantity > 0 ? true : false;
    }
    return productInDb.save();
  }

  async createProduct(product: CreateProductDto, { userId }: IAuthContext) {
    const storeInDb = await this.storesService.checkIfStoreExists(
      product.storeId,
      userId,
    );
    const productExists = await this.productModel.findOne({
      store: { _id: storeInDb.id },
      name: product.name.trim(),
    });
    if (productExists)
      throw new ConflictException(
        `Product with name: ${product.name} already exists in provided store`,
      );
    delete product.storeId;
    const createdProduct = await new this.productModel({
      ...product,
      ...(product.quantity > 0
        ? { availability: true }
        : { availability: false }),
      store: storeInDb,
    }).save();
    storeInDb.products.push(createdProduct);
    await storeInDb.save();
    return createdProduct.toObject({
      transform: (_doc, ret) => {
        delete ret.products;
        return ret;
      },
    });
  }
}
