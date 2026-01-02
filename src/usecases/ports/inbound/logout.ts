import type UseCase from "./use-case";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface LogoutUserUseCase extends UseCase<string | undefined, void> {}