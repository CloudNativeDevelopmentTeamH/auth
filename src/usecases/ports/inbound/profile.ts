import type User from "../../../entities/user";
import type UseCase from "./use-case";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface FetchUserProfileUseCase extends UseCase<string | undefined, User> {}