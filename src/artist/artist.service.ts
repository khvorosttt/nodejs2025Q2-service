import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismadbService } from 'src/prismadb/prismadb.service';
import { objectCropping } from 'src/common/utils';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismadbService) {}

  async create(createArtistDto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: createArtistDto,
    });
    return objectCropping(newArtist, 'isFavorite');
  }

  async findAll() {
    return (await this.prisma.artist.findMany()).map((artist) =>
      objectCropping(artist, 'isFavorite'),
    );
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    return objectCropping(artist, 'isFavorite');
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    if (updateArtistDto.grammy) {
      artist.grammy = updateArtistDto.grammy;
    }
    artist.name = updateArtistDto.name || artist.name;
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }
    await this.prisma.artist.update({
      where: {
        id,
      },
      data: artist,
    });
    return objectCropping(artist, 'isFavorite');
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
}
