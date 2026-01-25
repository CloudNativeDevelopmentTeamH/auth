import * as grpc from '@grpc/grpc-js';
import type AuthenticateUser from '../../usecases/authenticate.ts';
import type { AuthenticateRequest, AuthenticateResponse } from './proto-loader.ts';
import UnauthorizedError from '../../usecases/errors/unauthorized.ts';

export default class AuthGrpcService {
  constructor(private authenticateUser: AuthenticateUser) {}

  authenticate = async (
    call: grpc.ServerUnaryCall<AuthenticateRequest, AuthenticateResponse>,
    callback: grpc.sendUnaryData<AuthenticateResponse>
  ): Promise<void> => {
    try {
      const { token } = call.request;
      const userId = await this.authenticateUser.execute(token);
      
      callback(null, { user_id: userId });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        callback({
          code: grpc.status.UNAUTHENTICATED,
          message: error.message,
          name: 'UNAUTHENTICATED',
        });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'Internal server error',
          name: 'INTERNAL',
        });
      }
    }
  };
}
