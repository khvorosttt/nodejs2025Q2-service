import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './interfaces/track.interface';
import { PrismadbService } from 'src/prismadb/prismadb.service';
import { objectCropping } from 'src/common/utils';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismadbService) {}

  async create(createTrackDto: CreateTrackDto) {
    const newTrack: ITrack = await this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
      },
    });
    return objectCropping(newTrack, 'isFavorite');
  }

  async findAll() {
    return (await this.prisma.track.findMany()).map((track) =>
      objectCropping(track, 'isFavorite'),
    );
  }

  async findOne(id: string) {
    const track: ITrack = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    return objectCropping(track, 'isFavorite');
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track: ITrack = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    track.name = updateTrackDto.name || track.name;
    track.artistId = updateTrackDto.artistId || track.artistId;
    track.albumId = updateTrackDto.albumId || track.albumId;
    track.duration = updateTrackDto.duration || track.duration;
    await this.prisma.track.update({
      where: {
        id,
      },
      data: track,
    });
    return objectCropping(track, 'isFavorite');
  }

  async remove(id: string) {
    const track: ITrack = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    await this.prisma.track.delete({
      where: {
        id,
      },
    });
  }
}
