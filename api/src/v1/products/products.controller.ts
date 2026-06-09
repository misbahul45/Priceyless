import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { createProductSchema, updateProductSchema } from './schemas/product.schema';
import { uuidParamSchema } from '../../common/schemas/params.schema';
import type { CreateProductDto, UpdateProductDto } from './schemas/product.schema';
import type { UuidParamDto } from '../../common/schemas/params.schema';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../../generated/prisma/client';

@Controller('v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body(new ZodValidationPipe(createProductSchema)) createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      message: 'Product created successfully',
      data: product
    };
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return {
      message: 'Products fetched successfully',
      data: products
    };
  }

  @Get(':id')
  async findOne(@Param(new ZodValidationPipe(uuidParamSchema)) params: UuidParamDto) {
    const product = await this.productsService.findOne(params.id);
    return {
      message: 'Product fetched successfully',
      data: product
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param(new ZodValidationPipe(uuidParamSchema)) params: UuidParamDto, 
    @Body(new ZodValidationPipe(updateProductSchema)) updateProductDto: UpdateProductDto
  ) {
    const product = await this.productsService.update(params.id, updateProductDto);
    return {
      message: 'Product updated successfully',
      data: product
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param(new ZodValidationPipe(uuidParamSchema)) params: UuidParamDto) {
    await this.productsService.remove(params.id);
    return {
      message: 'Product deleted successfully',
      data: null
    };
  }
}

