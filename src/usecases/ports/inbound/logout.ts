import type UseCase from "./use-case.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface LogoutUserUseCase extends UseCase<string | undefined, void> {}