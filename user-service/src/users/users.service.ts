import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: { ...data, password: hashedPassword },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User with this email already exists');
      }
      console.error('User creation failed:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      console.error('Fetching users failed:', error);
      throw new InternalServerErrorException('Could not fetch users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      console.error(`Fetching user [${id}] failed:`, error);
      throw new InternalServerErrorException('Could not fetch user');
    }
  }
  async updateProfile(id: number, data: { name: string }) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { name: data.name },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      console.error(`Updating profile for user [${id}] failed:`, error);
      throw new InternalServerErrorException('Could not update profile');
    }
  }
  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      console.error(`Fetching user [${email}] failed:`, error);
      throw new InternalServerErrorException('Could not fetch user');
    }
  }
  async update(id: number, data: Partial<CreateUserDto>) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }
      console.error(`Updating user [${id}] failed:`, error);
      throw new InternalServerErrorException('Could not update user');
    }
  }
  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      return {
        message: `User with id ${id} deleted successfully`,
        user,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found or already deleted');
      }
      console.error(`Deleting user [${id}] failed:`, error);
      throw new InternalServerErrorException('Could not delete user');
    }
  }
  async changeRole(
    id: number,
    role: UserRole,
    requestingUser: { role: string },
  ) {
    await this.findOne(id);
    if (requestingUser.role !== UserRole.ADMIN.toString()) {
      throw new ForbiddenException('Only admins can change roles');
    }
    return this.update(id, { role });
  }
}
