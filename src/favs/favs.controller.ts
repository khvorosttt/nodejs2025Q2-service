import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('track/:id')
  addTrack(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.addTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.addAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.addArtist(id);
  }

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.removeTrack(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.removeAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.removeArtist(id);
  }
}
