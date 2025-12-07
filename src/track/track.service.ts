import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './interfaces/track.interface';
import { FavsService } from 'src/favs/favs.service';
import { PrismadbService } from 'src/prismadb/prismadb.service';
import { objectCropping } from 'src/common/utils';

@Injectable()
export class TrackService {
  private tracks = new Map<string, ITrack>();

  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    private readonly prisma: PrismadbService,
  ) {}

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
    this.prisma.track.update({
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
    this.prisma.track.delete({
      where: {
        id,
      },
    });
    const trackInFavs = this.favsService.findOneTrack(id);
    if (trackInFavs) {
      this.favsService.removeTrack(id);
    }
  }
}
