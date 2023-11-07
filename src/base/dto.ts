import { Type as NestJSType } from '@nestjs/common';
import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { OrderDir } from 'src/types';

export class BasePaginatedResponseDto<T> {
  pagination?: {
    total: number;
    limit: number;
    page: number;
    size: number;
    pages: number;
    offset?: number;
  };

  data: T[];

  static clone(this, dataType: NestJSType<any>) {
    this.data = [dataType];
    return this;
  }
}

export class PaginationInput {
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  orderBy?: string = '';

  @IsOptional()
  @IsEnum(OrderDir)
  orderDir?: OrderDir;
}
