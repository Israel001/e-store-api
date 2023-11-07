import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  weight: string;

  @IsString()
  category: string;

  @IsString()
  brand: string;

  @IsString()
  storeId: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity: number;

  @IsString()
  @IsOptional()
  weight: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  brand: string;
}
