import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsString()
  @MaxLength(25)
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
