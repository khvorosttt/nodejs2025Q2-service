import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';
import { PrismadbService } from 'src/prismadb/prismadb.service';
import { objectCropping } from 'src/common/utils';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    private readonly prisma: PrismadbService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      },
    });
    return objectCropping(newAlbum, 'isFavorite');
  }

  async findAll() {
    return (await this.prisma.album.findMany()).map((album) =>
      objectCropping(album, 'isFavorite'),
    );
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    return objectCropping(album);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    album.name = updateAlbumDto.name || album.name;
    album.year = updateAlbumDto.year || album.year;
    album.artistId = updateAlbumDto.artistId || album.artistId;
    await this.prisma.album.update({
      where: {
        id,
      },
      data: album,
    });
    return objectCropping(album);
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    await this.prisma.album.delete({
      where: {
        id,
      },
    });
    (await this.trackService.findAll()).forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
        this.trackService.update(track.id, track);
      }
    });
  }
}
