import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  private users = new Map<string, IUser>();

  create(createUserDto: CreateUserDto): User {
    const currentDate = new Date().getTime();
    const newUser: IUser = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    this.users.set(newUser.id, newUser);
    return plainToClass(User, newUser);
  }

  findAll() {
    return Array.from(this.users.values()).map((user) =>
      plainToClass(User, user),
    );
  }

  findOne(id: string) {
    const user = this.users.get(id);
    if (user) {
      return plainToClass(User, user);
    } else {
      throw new NotFoundException('User not found.');
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(
        'The old password does not match the one stored in the database.',
      );
    }
    user.version++;
    user.updatedAt = new Date().getTime();
    user.password = updateUserDto.newPassword;
    this.users.set(user.id, user);
    return plainToClass(User, user);
  }

  remove(id: string) {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    this.users.delete(id);
  }
}
