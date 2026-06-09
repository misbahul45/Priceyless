import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(private prisma: DatabaseService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) throw new NotFoundException('Category not found');

    if (category._count.products > 0) {
      throw new BadRequestException(
        'Cannot delete category with associated products'
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
