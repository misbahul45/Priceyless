import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../generated/prisma/client';
import { DatabaseService } from '../../database/database.service';

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findSafeById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSafeSelect,
    });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(data: any): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}

