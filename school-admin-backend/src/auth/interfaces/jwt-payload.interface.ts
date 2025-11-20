import { UserRole } from '../../common/enums';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: UserRole;
}
