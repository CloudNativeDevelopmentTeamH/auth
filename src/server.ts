import app from './infrastructure/api/app.ts';
import config from './infrastructure/utils/config.ts';
import { createGrpcServer, startGrpcServer } from './infrastructure/grpc/grpc-server.ts';

// Start HTTP server
const httpServer = app.listen(config.port, () => {
  console.log(`Express is listening at http://localhost:${config.port}`);
});

// Start gRPC server
const grpcServer = createGrpcServer();
startGrpcServer(grpcServer, config.grpcPort);

// Graceful shutdown — SIGTERM is sent by Docker/Kubernetes on stop/scale-down
function shutdown(signal: string): void {
  console.log(`Received ${signal}, shutting down gracefully...`);

  httpServer.close(() => {
    console.log('HTTP server closed.');
    grpcServer.tryShutdown((err) => {
      if (err) console.error('gRPC shutdown error:', err);
      else console.log('gRPC server closed.');
      process.exit(0);
    });
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Shutdown timed out, forcing exit.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
