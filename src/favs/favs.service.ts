import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFavoritesResponse } from './interfaces/favs.interface';
import { IAlbum } from 'src/album/interfaces/album.interface';
import { ITrack } from 'src/track/interfaces/track.interface';
import { IArtist } from 'src/artist/interfaces/artist.interface';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class FavsService {
  private favorites: IFavoritesResponse = {
    artists: [],
    albums: [],
    tracks: [],
  };
  private artists = new Map<string, IArtist>();
  private albums = new Map<string, IAlbum>();
  private tracks = new Map<string, ITrack>();

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly tracksService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumsService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistsService: ArtistService,
  ) {}

  addTrack(id: string) {
    const track = this.tracksService.findAll().find((track) => track.id === id);
    if (track) {
      if (!this.tracks.has(track.id)) {
        this.tracks.set(track.id, track);
        this.favorites.tracks = Array.from(this.tracks.values());
      }
    } else {
      throw new UnprocessableEntityException(`Track with ${id} doesn't exist`);
    }
  }

  addAlbum(id: string) {
    const album = this.albumsService.findAll().find((album) => album.id === id);
    if (album) {
      if (!this.albums.has(album.id)) {
        this.albums.set(album.id, album);
        this.favorites.albums = Array.from(this.albums.values());
      }
    } else {
      throw new UnprocessableEntityException(`Album with ${id} doesn't exist`);
    }
  }

  addArtist(id: string) {
    const artist = this.artistsService
      .findAll()
      .find((artist) => artist.id === id);
    if (artist) {
      if (!this.artists.has(artist.id)) {
        this.artists.set(artist.id, artist);
        this.favorites.artists = Array.from(this.artists.values());
      }
    } else {
      throw new UnprocessableEntityException(`Artist with ${id} doesn't exist`);
    }
  }

  findAll() {
    return this.favorites;
  }

  findOneTrack(id: string) {
    return this.tracks.get(id);
  }

  findOneAlbum(id: string) {
    return this.albums.get(id);
  }

  findOneArtist(id: string) {
    return this.artists.get(id);
  }

  removeTrack(id: string) {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track not found in favorites.');
    }
    this.tracks.delete(id);
    this.favorites.tracks = Array.from(this.tracks.values());
  }

  removeAlbum(id: string) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException('Album not found in favorites.');
    }
    this.albums.delete(id);
    this.favorites.albums = Array.from(this.albums.values());
  }

  removeArtist(id: string) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist not found in favorites.');
    }
    this.artists.delete(id);
    this.favorites.artists = Array.from(this.artists.values());
  }
}
