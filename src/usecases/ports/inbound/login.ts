import type LoginUserInputDTO from "../../dtos/login-user-input.ts";
import type UseCase from "./use-case.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface LoginUserUseCase extends UseCase<LoginUserInputDTO, string> {}