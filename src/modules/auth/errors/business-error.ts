import { BusinessError } from 'incident-management-commons';

export class BusinessErrors {

  public static readonly InvalidToken = new BusinessError(
    'AUTH.InvalidToken',
    'Invalid token',
  );

  public static readonly UserIsInactive = new BusinessError(
    'AUTH.UserIsInactive',
    'User is inactive. Please contact the administrator',
  );

  public static readonly RefreshTokenHasExpired = new BusinessError(
    'AUTH.RefreshTokenHasExpired',
    'Refresh token has expired',
  );

  public static readonly UserNotFound = new BusinessError(
    'AUTH.UserNotFound',
    'User not found',
  );

  public static readonly InvalidCredentials = new BusinessError(
    'AUTH.InvalidCredentials',
    'Invalid credentials',
  );
}
