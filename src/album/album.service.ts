import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbum } from './interfaces/album.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumService {
  private albums = new Map<string, IAlbum>();
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: IAlbum = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.set(newAlbum.id, newAlbum);
    return newAlbum;
  }

  findAll() {
    return Array.from(this.albums.values());
  }

  findOne(id: string) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    album.name = updateAlbumDto.name || album.name;
    album.year = updateAlbumDto.year || album.year;
    album.artistId = updateAlbumDto.artistId || album.artistId;
    this.albums.set(album.id, album);
    return album;
  }

  remove(id: string) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException('Album not found.');
    }
    this.albums.delete(id);
  }
}
