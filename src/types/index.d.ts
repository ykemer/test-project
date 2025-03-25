import {UserDto} from '../../libs/dto/domain/models/UserDto';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDto;
      traceId: string;
    }
  }
}

export default Express;
