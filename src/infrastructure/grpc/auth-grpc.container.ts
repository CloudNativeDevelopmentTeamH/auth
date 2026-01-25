import AuthenticateUser from "../../usecases/authenticate.ts";
import JwtTokenService from "../auth/jwt-token-service.ts";
import AuthGrpcService from "../../adapters/grpc/AuthGrpcService.ts";

const tokenService = new JwtTokenService();
const authenticateUser = new AuthenticateUser(tokenService);
const authGrpcService = new AuthGrpcService(authenticateUser);

export default authGrpcService;
