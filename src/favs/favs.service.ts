import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismadbService } from 'src/prismadb/prismadb.service';
import { objectCropping } from 'src/common/utils';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismadbService) {}

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (track) {
      if (!track.isFavorite) {
        track.isFavorite = true;
        await this.prisma.track.update({
          where: {
            id,
          },
          data: track,
        });
      }
    } else {
      throw new UnprocessableEntityException(`Track with ${id} doesn't exist`);
    }
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    if (album) {
      if (!album.isFavorite) {
        album.isFavorite = true;
        await this.prisma.album.update({
          where: {
            id,
          },
          data: album,
        });
      }
    } else {
      throw new UnprocessableEntityException(`Album with ${id} doesn't exist`);
    }
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (artist) {
      if (!artist.isFavorite) {
        artist.isFavorite = true;
        await this.prisma.artist.update({
          where: {
            id,
          },
          data: artist,
        });
      }
    } else {
      throw new UnprocessableEntityException(`Artist with ${id} doesn't exist`);
    }
  }

  async findAll() {
    const tracks = (
      await this.prisma.track.findMany({
        where: { isFavorite: true },
      })
    ).map((track) => objectCropping(track, 'isFavorite'));
    const albums = (
      await this.prisma.album.findMany({
        where: { isFavorite: true },
      })
    ).map((album) => objectCropping(album, 'isFavorite'));
    const artists = (
      await this.prisma.artist.findMany({
        where: { isFavorite: true },
      })
    ).map((artist) => objectCropping(artist, 'isFavorite'));
    return { tracks, albums, artists };
  }

  async findOneTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    return objectCropping(track, 'isFavorite');
  }

  async findOneAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    return objectCropping(album, 'isFavorite');
  }

  async findOneArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    return objectCropping(artist, 'isFavorite');
  }

  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track || !track.isFavorite) {
      throw new NotFoundException('Track not found in favorites.');
    }
    await this.prisma.track.update({
      where: { id },
      data: { isFavorite: false },
    });
  }

  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
    if (!album || !album.isFavorite) {
      throw new NotFoundException('Album not found in favorites.');
    }
    await this.prisma.album.update({
      where: { id },
      data: { isFavorite: false },
    });
  }

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist || !artist.isFavorite) {
      throw new NotFoundException('Artist not found in favorites.');
    }
    await this.prisma.artist.update({
      where: { id },
      data: { isFavorite: false },
    });
  }
}
