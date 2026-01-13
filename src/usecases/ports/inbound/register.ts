import type User from "../../../entities/user.ts";
import type RegisterUserInputDTO from "../../dtos/register-user-input.ts";
import type UseCase from "./use-case.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface RegisterUserUseCase extends UseCase<RegisterUserInputDTO, User> {}