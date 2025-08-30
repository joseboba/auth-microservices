import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'incident-management-commons';
import { LoginRequestDto, LoginResponseDto, RefreshRequestDto } from '@dtos';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand, RefreshTokenCommand } from '../commands/impl';

@Controller()
export class AuthController {
  constructor(private readonly _command: CommandBus) {}

  @Post('login')
  @Public()
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this._command.execute(new LoginCommand(loginRequestDto));
  }

  @Post('refresh')
  @Public()
  async refresh(
    @Body() refreshTokenDto: RefreshRequestDto,
  ): Promise<LoginResponseDto> {
    return await this._command.execute(
      new RefreshTokenCommand(refreshTokenDto.refreshToken),
    );
  }
}
