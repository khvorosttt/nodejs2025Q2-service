import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtist } from './interfaces/artist.interface';
import { randomUUID } from 'crypto';
import { FavsService } from 'src/favs/favs.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  private artists = new Map<string, IArtist>();

  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

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
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }
    this.artists.set(artist.id, artist);
    return artist;
  }

  remove(id: string) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    this.artists.delete(artist.id);
    const artistInFavs = this.favsService.findOneArtist(id);
    if (artistInFavs) {
      this.favsService.removeArtist(id);
    }
    this.trackService.findAll().forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
        this.trackService.update(track.id, track);
      }
    });
    this.albumService.findAll().forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
        this.albumService.update(album.id, album);
      }
    });
  }
}
