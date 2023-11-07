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
import { StoresService } from './stores.service';
import { CreateStoreDto } from './stores.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth-guard';
import { DeleteResult } from 'mongodb';
import { PaginationInput } from '../../base/dto';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() store: CreateStoreDto, @Req() req: any) {
    return this.storesService.createStore(store, req.user);
  }

  @Get()
  fetch(@Query('pagination') pagination: PaginationInput, @Req() req: any) {
    return this.storesService.fetchUserStores(pagination, req.user);
  }

  @Get(':id')
  fetchById(@Param('id') id: string, @Req() req: any) {
    return this.storesService.fetchUserStoreById(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() store: CreateStoreDto,
    @Req() req: any,
  ) {
    return this.storesService.updateUserStore(id, store, req.user);
  }

  @Put(':id/clear-products')
  clearStoreProducts(@Param('id') id: string, @Req() req: any) {
    return this.storesService.clearStoreProducts(id, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any): Promise<DeleteResult> {
    return this.storesService.deleteUserStore(id, req.user);
  }
}
