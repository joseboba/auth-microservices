import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMenuOptionEntity, UserAppEntity } from '@entities';
import { Repository } from 'typeorm';
import { JwtTokenService } from '@services';
import { BusinessErrors } from '../../errors/business-error';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from '@dtos';
import { Logger } from '@nestjs/common';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly _logger = new Logger(LoginHandler.name);
  constructor(
    @InjectRepository(UserAppEntity)
    private readonly _userAppRepository: Repository<UserAppEntity>,
    @InjectRepository(RoleMenuOptionEntity)
    private readonly _roleMenuOptionRepository: Repository<RoleMenuOptionEntity>,
    private readonly _jwtService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { email, password } = command.loginRequestDto;
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

    const isSame = await bcrypt.compare(password, findUser.password);
    if (!isSame) {
      this._logger.error('Password is incorrect');
      throw BusinessErrors.InvalidCredentials;
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

    const refreshToken = this._jwtService.getRefreshToken(email);

    const decodedToken = this._jwtService.decodeJwtToken(token);
    const decodedRefreshToken = this._jwtService.decodeJwtToken(refreshToken);

    return {
      accessToken: token,
      refreshToken: refreshToken,
      expiresIn: decodedToken.exp,
      refreshExpiresIn: decodedRefreshToken.exp
    };
  }
}
