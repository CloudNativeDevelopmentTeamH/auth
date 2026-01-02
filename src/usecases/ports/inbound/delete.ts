import type UseCase from "./use-case";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface DeleteUserUseCase extends UseCase<string | undefined, void> {}