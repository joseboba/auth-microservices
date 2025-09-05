import { RefreshTokenCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginResponseDto } from '@dtos';
import { BusinessErrors } from '../../errors/business-error';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMenuOptionEntity, UserAppEntity } from '@entities';
import { Repository } from 'typeorm';
import { JwtTokenService } from '@services';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  private readonly _logger = new Logger(RefreshTokenHandler.name);

  constructor(
    @InjectRepository(UserAppEntity)
    private readonly _userAppRepository: Repository<UserAppEntity>,
    @InjectRepository(RoleMenuOptionEntity)
    private readonly _roleMenuOptionRepository: Repository<RoleMenuOptionEntity>,
    private readonly _jwtService: JwtTokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<LoginResponseDto> {
    const { refreshToken } = command;

    const decodedTokenRequest = this._jwtService.decodeJwtToken(refreshToken);
    const email = decodedTokenRequest.email;
    const expDate = new Date(decodedTokenRequest.exp * 1000);

    if (expDate < new Date()) {
      throw BusinessErrors.RefreshTokenHasExpired;
    }

    const findUser = await this._userAppRepository.findOne({
      where: { email },
      relations: { userType: true },
    });

    if (!findUser) {
      this._logger.error('User Not Found');
      throw BusinessErrors.UserNotFound;
    }

    if (!findUser.isActive) {
      this._logger.error('User Is Inactive');
      throw BusinessErrors.UserIsInactive;
    }

    const options = await this._roleMenuOptionRepository.find({
      where: { roleCode: findUser.userType.roleCode },
    });
    const authorities = options.map((e) => e.menuOptionCode);

    const token = this._jwtService.getJwtToken({
      email,
      name: findUser.name,
      userType: findUser.userType.userTypeCode,
      authorities,
    });

    const refreshTokenContent = this._jwtService.getRefreshToken(email);
    const decodedToken = this._jwtService.decodeJwtToken(token);
    const decodedRefreshToken = this._jwtService.decodeJwtToken(refreshTokenContent);

    return {
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: decodedToken.exp,
      refreshExpiresIn: decodedRefreshToken.exp
    };
  }
}
