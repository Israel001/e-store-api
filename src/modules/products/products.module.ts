import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthConfiguration } from 'src/config/configuration';
import { JwtAuthConfig } from 'src/config/types/jwt-auth.config';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Store, StoreSchema } from 'src/schemas/store.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ConfigModule.forRoot({
      load: [JwtAuthConfiguration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [JwtAuthConfiguration] })],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtAuthConfig>('jwtAuthConfig').secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    StoresModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy],
  exports: [ProductsService],
})
export class ProductsModule {}
