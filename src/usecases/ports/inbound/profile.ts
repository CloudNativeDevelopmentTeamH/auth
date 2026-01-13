import type User from "../../../entities/user.ts";
import type UseCase from "./use-case.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface FetchUserProfileUseCase extends UseCase<string | undefined, User> {}