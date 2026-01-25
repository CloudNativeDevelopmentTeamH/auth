export default interface HTTPResponse<T = unknown> {
  statusCode: number;
  body?: T;
  token?: string;
}