export type Dictionary<T> = { [key: string]: T };
export type JSONObject = Record<string, unknown>;
export type BodyType = JSONObject | string | FormData;

export const enum HttpResponseType {
  Json,
  Text
}

export interface CacheData {
  expired: number;
  data: unknown;
}