import { ApiProperty } from '@nestjs/swagger';
import { Type as NestJSType } from '@nestjs/common';
import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { OrderDir } from 'src/types';

export class BasePaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Response pagination data',
    required: false,
    default: { total: 50, limit: 10, page: 2, size: 10, pages: 5 },
  })
  pagination?: {
    total: number;
    limit: number;
    page: number;
    size: number;
    pages: number;
    offset?: number;
  };

  @ApiProperty({
    description: 'Response data array',
    nullable: true,
    default: [],
  })
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
