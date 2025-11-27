import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './interfaces/track.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  private tracks = new Map<string, ITrack>();

  create(createTrackDto: CreateTrackDto) {
    const newTrack: ITrack = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.set(newTrack.id, newTrack);
    return newTrack;
  }

  findAll() {
    return Array.from(this.tracks.values());
  }

  findOne(id: string) {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    track.name = updateTrackDto.name || track.name;
    track.artistId = updateTrackDto.artistId || track.artistId;
    track.albumId = updateTrackDto.albumId || track.albumId;
    track.duration = updateTrackDto.duration || track.duration;
    this.tracks.set(track.id, track);
    return track;
  }

  remove(id: string) {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track not found.');
    }
    this.tracks.delete(id);
  }
}
