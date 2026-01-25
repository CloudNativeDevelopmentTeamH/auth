import app from './infrastructure/api/app.js';
import config from './infrastructure/utils/config.ts';
import { createGrpcServer, startGrpcServer } from './infrastructure/grpc/grpc-server.ts';

// Start HTTP server
app.listen(config.port, () => {
  return console.log(`Express is listening at http://localhost:${config.port}`);
});

// Start gRPC server
const grpcServer = createGrpcServer();
startGrpcServer(grpcServer, config.grpcPort);
