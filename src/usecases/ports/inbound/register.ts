import type User from "../../../entities/user";
import type RegisterUserInputDTO from "../../dtos/register-user-input";
import type UseCase from "./use-case";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface RegisterUserUseCase extends UseCase<RegisterUserInputDTO, User> {}