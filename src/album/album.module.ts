import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavsModule } from 'src/favs/favs.module';
import { TrackModule } from 'src/track/track.module';
import { PrismadbModule } from 'src/prismadb/prismadb.module';

@Module({
  imports: [
    forwardRef(() => FavsModule),
    forwardRef(() => TrackModule),
    PrismadbModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
