import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('album')
@UseGuards(AuthGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.albumService.remove(id);
  }
}
