import { HttpClient } from './client';
import { HEADER_META_DATA, PATH_PARAM_META_DATA, RESPONSE_META_DATA, RESPONSE_TYPE_META_DATA } from './constants';
import { HttpResponseType } from './types';

export function addHeadersToClient(client: HttpClient, target: any) {
  const headers: Map<string, string> = Reflect.getMetadata(HEADER_META_DATA, target);

  for (const [key, value] of headers) {
    client.setHeader(key, value);
  }
}

export function appendResponseToArgs(data: any, args: any[], target: any, propertyKey: string | symbol): any[] {
  const reponseIndex: number = Reflect.getOwnMetadata(
    RESPONSE_META_DATA,
    target,
    propertyKey
  );

  if (data && reponseIndex >= 0) {
    args.splice(reponseIndex, 1, data);
  }

  return args;
}

export function addParamsToPath(path: string, args: any[], target: any, propertyKey: string | symbol): string {
  const params: Map<string, number> = Reflect.getOwnMetadata(
    PATH_PARAM_META_DATA,
    target,
    propertyKey
  );

  if (params) {
    for (const [key, value] of params) {
      path = path.replace(`:${key}`, args[value]);
    }
  }

  return path;
}

export async function getDataFromResponse(response: Response, target: any, propertyKey: string | symbol): Promise<any> {
  const responseType: HttpResponseType = Reflect.getOwnMetadata(
    RESPONSE_TYPE_META_DATA,
    target,
    propertyKey
  );

  let data;

  if (responseType === HttpResponseType.Json) {
    data = await response.json();
  } else if (responseType === HttpResponseType.Text) {
    data = await response.text();
  }

  return data;
}