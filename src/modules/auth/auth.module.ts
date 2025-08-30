import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleMenuOptionEntity, UserAppEntity } from '@entities';
import { CommandHandlers } from './commands/handlers';
import { JwtTokenService } from '@services';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { UserAppTypeEntity } from './entities/user-app-type.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    TypeOrmModule.forFeature([
      RoleMenuOptionEntity,
      UserAppEntity,
      UserAppTypeEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, JwtStrategy, JwtTokenService],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
