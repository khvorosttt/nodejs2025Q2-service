import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavsModule } from 'src/favs/favs.module';
import { PrismadbModule } from 'src/prismadb/prismadb.module';

@Module({
  imports: [forwardRef(() => FavsModule), PrismadbModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
