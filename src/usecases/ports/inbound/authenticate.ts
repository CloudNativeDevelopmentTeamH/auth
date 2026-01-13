import type UseCase from "./use-case.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface AuthenticateUserUseCase extends UseCase<string, number> {}