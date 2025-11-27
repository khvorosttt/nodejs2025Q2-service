import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtist } from './interfaces/artist.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  private artists = new Map<string, IArtist>();

  create(createArtistDto: CreateArtistDto) {
    const newArtist: IArtist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.set(newArtist.id, newArtist);
    return newArtist;
  }

  findAll() {
    return Array.from(this.artists.values());
  }

  findOne(id: string) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    if (updateArtistDto.grammy) {
      artist.grammy = updateArtistDto.grammy;
    }
    artist.name = updateArtistDto.name || artist.name;
    artist.grammy = updateArtistDto.grammy || artist.grammy;
    this.artists.set(artist.id, artist);
    return artist;
  }

  remove(id: string) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    this.artists.delete(artist.id);
  }
}
