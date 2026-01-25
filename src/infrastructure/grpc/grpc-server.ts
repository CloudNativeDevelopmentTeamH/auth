import * as grpc from '@grpc/grpc-js';
import { authProto } from './proto-loader.ts';
import authGrpcService from './auth-grpc.container.ts';

export function createGrpcServer(): grpc.Server {
  const server = new grpc.Server();

  server.addService(authProto.AuthService.service, {
    authenticate: authGrpcService.authenticate,
  });

  return server;
}

export function startGrpcServer(server: grpc.Server, port: number): void {
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) {
        console.error('Failed to start gRPC server:', err);
        return;
      }
      console.log(`gRPC server is listening on port ${boundPort}`);
    }
  );
}
