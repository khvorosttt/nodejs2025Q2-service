import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import { PrismadbService } from 'src/prismadb/prismadb.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismadbService) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return plainToClass(User, newUser);
  }

  async findAll() {
    return (await this.prisma.user.findMany()).map((user) =>
      plainToClass(User, user),
    );
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) {
      return plainToClass(User, user);
    } else {
      throw new NotFoundException('User not found.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(
        'The old password does not match the one stored in the database.',
      );
    }
    user.version++;
    user.password = updateUserDto.newPassword;
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: updateUserDto.newPassword,
        version: user.version,
        updatedAt: new Date(),
      },
    });
    return plainToClass(User, updatedUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    } else {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    }
  }
}
