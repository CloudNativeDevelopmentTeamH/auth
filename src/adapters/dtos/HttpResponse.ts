export default interface HTTPResponse<T = unknown> {
    statusCode: number;
    body?: T;
    cookie?: {
        name: string;
        value: string;
        options: {
            httpOnly?: boolean;
            secure?: boolean;
            maxAge?: number;
            path?: string;
            sameSite?: "strict" | "lax" | "none";
        }
    }
}