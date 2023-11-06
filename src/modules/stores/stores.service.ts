import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from 'src/schemas/store.schema';
import { CreateStoreDto } from './stores.dto';
import { IAuthContext } from 'src/types';
import { User } from 'src/schemas/user.schema';
import { DeleteResult } from 'mongodb';
import { Product } from 'src/schemas/product.schema';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async fetchUserStores(pagination: PaginationInput, { userId }: IAuthContext) {
    const { page = 1, limit = 20 } = pagination;
    const orderBy = pagination.orderBy || 'createdAt';
    const orderDir = pagination.orderDir || 'desc';
    const stores = await this.storeModel
      .find({ user: { _id: userId } }, {}, { skip: limit * (page - 1), limit })
      .populate('products')
      .sort({ [orderBy]: orderDir })
      .exec();
    return buildResponseDataWithPagination(stores, stores.length, {
      page,
      limit,
    });
  }

  async fetchUserStoreById(id: string, { userId }: IAuthContext) {
    const storeExists = await this.storeModel
      .findOne({
        _id: new Types.ObjectId(id),
        user: { _id: new Types.ObjectId(userId) },
      })
      .populate('products')
      .exec();
    if (!storeExists) throw new NotFoundException('Store not found');
    return storeExists;
  }

  async updateUserStore(
    id: string,
    store: CreateStoreDto,
    { userId }: IAuthContext,
  ) {
    const storeInDb = await this.checkIfStoreExists(id, userId);
    const duplicateFound = await this.storeModel.findOne({
      name: store.name,
      _id: { $ne: id },
    });
    if (duplicateFound)
      throw new ConflictException(
        `Another store with name: ${store.name} already exists`,
      );
    storeInDb.name = store.name;
    return storeInDb.save();
  }

  async clearStoreProducts(id: string, { userId }: IAuthContext) {
    const storeInDb = await this.checkIfStoreExists(id, userId);
    storeInDb.products = [];
    await this.productModel
      .deleteMany({
        store: { _id: storeInDb._id },
      })
      .exec();
    return storeInDb.save();
  }

  async checkIfStoreExists(storeId: string, userId: string) {
    const storeExists = await this.storeModel
      .findOne({
        _id: new Types.ObjectId(storeId),
        user: { _id: new Types.ObjectId(userId) },
      })
      .exec();
    if (!storeExists) throw new NotFoundException('Store not found');
    return storeExists;
  }

  async deleteUserStore(
    id: string,
    { userId }: IAuthContext,
  ): Promise<DeleteResult> {
    const storeInDb = await this.checkIfStoreExists(id, userId);
    await this.productModel
      .deleteMany({
        store: { _id: storeInDb._id },
      })
      .exec();
    return this.storeModel
      .deleteOne({
        _id: storeInDb._id,
      })
      .exec();
  }

  async createStore(store: CreateStoreDto, { userId }: IAuthContext) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('Authenticated user not found');
    const existingStore = await this.storeModel
      .findOne({ name: store.name })
      .exec();
    if (existingStore)
      throw new ConflictException(`Store name: ${store.name} is already taken`);
    const createdStore = await new this.storeModel({
      name: store.name,
      user,
    }).save();
    user.store.push(createdStore);
    await user.save();
    return createdStore.toObject({
      transform: (_doc, ret) => {
        delete ret.store;
        return ret;
      },
    });
  }
}
