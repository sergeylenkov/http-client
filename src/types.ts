export type Dictionary<T> = { [key: string]: T };
export type JSONObject = Record<string, unknown>;

export const enum HttpResponseType {
  Json,
  Text
}