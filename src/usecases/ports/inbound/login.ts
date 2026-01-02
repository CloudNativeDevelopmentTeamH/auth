import type LoginUserInputDTO from "../../dtos/login-user-input";
import type UseCase from "./use-case";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface LoginUserUseCase extends UseCase<LoginUserInputDTO, string> {}