import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { createCategorySchema, updateCategorySchema } from './schemas/category.schema';
import { uuidParamSchema } from '../../common/schemas/params.schema';
import type { CreateCategoryDto, UpdateCategoryDto } from './schemas/category.schema';
import type { UuidParamDto } from '../../common/schemas/params.schema';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../../generated/prisma/client';

@Controller('v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body(new ZodValidationPipe(createCategorySchema)) createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      message: 'Category created successfully',
      data: category
    };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      message: 'Categories fetched successfully',
      data: categories
    };
  }

  @Get(':id')
  async findOne(@Param(new ZodValidationPipe(uuidParamSchema)) params: UuidParamDto) {
    const category = await this.categoriesService.findOne(params.id);
    return {
      message: 'Category fetched successfully',
      data: category
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param(new ZodValidationPipe(uuidParamSchema)) params: UuidParamDto, 
    @Body(new ZodValidationPipe(updateCategorySchema)) updateCategoryDto: UpdateCategoryDto
  ) {
    const category = await this.categoriesService.update(params.id, updateCategoryDto);
    return {
      message: 'Category updated successfully',
      data: category
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param(new ZodValidationPipe(uuidParamSchema)) params: UuidParamDto) {
    await this.categoriesService.remove(params.id);
    return {
      message: 'Category deleted successfully',
      data: null
    };
  }
}

