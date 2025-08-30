// Custom file imports
import { RoleMenuOptionEntity, UserAppEntity } from '@entities';
import { UserAppTypeEntity } from '../../modules/auth/entities/user-app-type.entity';

export const config = {
  db: {
    entities: [RoleMenuOptionEntity, UserAppEntity, UserAppTypeEntity],
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA,
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      audience: process.env.JWT_AUDIENCE,
    },
  },
};
