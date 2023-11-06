import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Product } from './product.schema';
import { User } from './user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StoreDocument = HydratedDocument<Store>;

@Schema({ timestamps: true })
export class Store extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
