import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  login: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
