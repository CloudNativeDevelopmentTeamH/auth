export default abstract class AppError extends Error {
    readonly abstract code: string;
    readonly abstract status: number;
    
    constructor(message: string) {
      super(message);
    }
}