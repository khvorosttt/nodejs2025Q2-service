import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismadbModule } from 'src/prismadb/prismadb.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismadbModule],
  exports: [UserService],
})
export class UserModule {}
