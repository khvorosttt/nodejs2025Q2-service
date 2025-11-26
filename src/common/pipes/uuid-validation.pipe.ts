import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as UUIDValidate } from 'uuid';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!UUIDValidate(value)) {
      throw new BadRequestException('id is invalid (not uuid).');
    }
    return value;
  }
}
