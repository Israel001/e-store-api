import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { PaginationInput } from 'src/base/dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() product: CreateProductDto, @Req() req: any) {
    return this.productsService.createProduct(product, req.user);
  }

  @Get()
  fetch(@Query('pagination') pagination: PaginationInput) {
    return this.productsService.fetchAllProducts(pagination);
  }

  @Get(':id')
  fetchById(@Param('id') id: string) {
    return this.productsService.fetchProductById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.updateProduct(id, product, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Req() req: any) {
    return this.productsService.deleteProduct(id, req.user);
  }
}
