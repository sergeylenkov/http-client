import 'reflect-metadata';
import { HttpClient } from './client';
import {
  BODY_META_DATA,
  CACHE_META_DATA,
  HEADER_META_DATA,
  HEADER_REQUEST_META_DATA,
  PATH_META_DATA,
  PATH_PARAM_META_DATA,
  QUERY_META_DATA,
  RESPONSE_META_DATA,
  RESPONSE_TYPE_META_DATA
} from './constants';
import { HttpResponseType } from './types';
import { addHeadersToClient, appendResponseToArgs, addParamsToPath, getDataFromResponse, getBodyParam, addQueryToPath, getPath, getRequestHeaders, getCacheLifetime } from './utils';

export function BaseUrl(url: string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      _url = url;
    }
  }
}

export function Header(key: string, value: string): ClassDecorator {
  return (constructor: any) => {
    const headers: Map<string, string> = Reflect.getOwnMetadata(
      HEADER_META_DATA,
      constructor.prototype
    ) || new Map();

    headers.set(key, value);

    Reflect.defineMetadata(HEADER_META_DATA, headers, constructor.prototype);
  };
}

export function Response(type?: HttpResponseType): ParameterDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    Reflect.defineMetadata(
      RESPONSE_META_DATA,
      parameterIndex,
      target,
      propertyKey
    );

    Reflect.defineMetadata(
      RESPONSE_TYPE_META_DATA,
      type,
      target,
      propertyKey
    );
  };
}

export function Param(name: string): ParameterDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    const params: Map<string, number> = Reflect.getOwnMetadata(
      PATH_PARAM_META_DATA,
      target,
      propertyKey
    ) || new Map();

    params.set(name, parameterIndex);

    Reflect.defineMetadata(PATH_PARAM_META_DATA, params, target, propertyKey);
  };
}

export function Body(): ParameterDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    Reflect.defineMetadata(
      BODY_META_DATA,
      parameterIndex,
      target,
      propertyKey
    );
  };
}

export function Query(): ParameterDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    Reflect.defineMetadata(
      QUERY_META_DATA,
      parameterIndex,
      target,
      propertyKey
    );
  };
}

export function Get(path: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(PATH_META_DATA, path, target, propertyKey);

    const method = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const client = this as unknown as HttpClient;

      addHeadersToClient(client, target);

      const requestHeaders = getRequestHeaders(target, propertyKey);

      let newPath = getPath(target, propertyKey);
      newPath = addParamsToPath(newPath, args, target, propertyKey);
      newPath = addQueryToPath(newPath, args, target, propertyKey);

      let data = client.getCache(newPath);
      const lifetime = getCacheLifetime(target, propertyKey);

      if (data === undefined) {
        const response = await client.get(newPath, requestHeaders);
        data = await getDataFromResponse(response, target, propertyKey);

        if (lifetime !== undefined) {
          client.setCache(newPath, data, lifetime);
        }
      }

      args = appendResponseToArgs(data, args, target, propertyKey);

      return method.apply(target, args);
    };
  };
}

export function Post(path: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(PATH_META_DATA, path, target, propertyKey);

    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const client = this as unknown as HttpClient;
      const body = getBodyParam(args, target, propertyKey);

      addHeadersToClient(client, target);

      const requestHeaders = getRequestHeaders(target, propertyKey);

      let newPath = getPath(target, propertyKey);
      newPath = addParamsToPath(newPath, args, target, propertyKey);

      const response = await client.post(newPath, body, requestHeaders);
      const data = await getDataFromResponse(response, target, propertyKey);

      args = appendResponseToArgs(data, args, target, propertyKey);

      return method.apply(target, args);
    };
  };
}

export function Patch(path: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(PATH_META_DATA, path, target, propertyKey);

    const method = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const client = this as unknown as HttpClient;
      const body = getBodyParam(args, target, propertyKey);

      addHeadersToClient(client, target);

      const requestHeaders = getRequestHeaders(target, propertyKey);

      let newPath = getPath(target, propertyKey);
      newPath = addParamsToPath(newPath, args, target, propertyKey);

      const response = await client.patch(newPath, body, requestHeaders);
      const data = await getDataFromResponse(response, target, propertyKey);

      args = appendResponseToArgs(data, args, target, propertyKey);

      return method.apply(target, args);
    };
  };
}

export function Delete(path: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(PATH_META_DATA, path, target, propertyKey);

    const method = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const client = this as unknown as HttpClient;

      addHeadersToClient(client, target);

      const requestHeaders = getRequestHeaders(target, propertyKey);

      let newPath = getPath(target, propertyKey);
      newPath = addParamsToPath(newPath, args, target, propertyKey);

      const response = await client.delete(newPath, requestHeaders);
      const data = await getDataFromResponse(response, target, propertyKey);

      args = appendResponseToArgs(data, args, target, propertyKey);

      return method.apply(target, args);
    };
  };
}

export function RequestHeader(key: string, value: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const headers: Map<string, string> = Reflect.getOwnMetadata(
      HEADER_REQUEST_META_DATA,
      target,
      propertyKey
    ) || new Map();

    headers.set(key, value);

    Reflect.defineMetadata(HEADER_REQUEST_META_DATA, headers, target, propertyKey);
  };
}

export function Cache(lifetime: number): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    Reflect.defineMetadata(CACHE_META_DATA, lifetime, target, propertyKey);
  };
}