import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RefreshRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}