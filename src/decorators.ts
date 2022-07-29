import 'reflect-metadata';
import { HttpClient } from './client';
import {
  BODY_META_DATA,
  HEADER_META_DATA,
  HTTP_CLIENT_META_DATA,
  PATH_PARAM_META_DATA,
  RESPONSE_META_DATA,
  RESPONSE_TYPE_META_DATA,
} from './constants';
import { HttpResponseType } from './types';
import { addHeadersToClient, appendResponseToArgs, addParamsToPath, getDataFromResponse, getBodyParam } from './utils';

export function Http(url: string): ClassDecorator {
  return (constructor: any) => {
    const client: HttpClient = new HttpClient(url);
    Reflect.defineMetadata(HTTP_CLIENT_META_DATA, client, global);
  };
}

export function Response(type?: HttpResponseType ): ParameterDecorator {
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

export function Get(path: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const method = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const client = Reflect.getMetadata(HTTP_CLIENT_META_DATA, global);

      addHeadersToClient(client, target);
      path = addParamsToPath(path, args, target, propertyKey);

      const response = await client.get(path);
      const data = await getDataFromResponse(response, target, propertyKey);

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
    const method = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const client = Reflect.getMetadata(HTTP_CLIENT_META_DATA, global);
      const body = getBodyParam(args, target, propertyKey);

      addHeadersToClient(client, target);
      path = addParamsToPath(path, args, target, propertyKey);

      const response = await client.post(path, body);
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
    const method = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const client = Reflect.getMetadata(HTTP_CLIENT_META_DATA, global);
      const body = getBodyParam(args, target, propertyKey);

      addHeadersToClient(client, target);
      path = addParamsToPath(path, args, target, propertyKey);

      const response = await client.patch(path, body);
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
    const method = descriptor.value;

    descriptor.value = async (...args: any[]) => {
      const client = Reflect.getMetadata(HTTP_CLIENT_META_DATA, global);

      addHeadersToClient(client, target);
      path = addParamsToPath(path, args, target, propertyKey);

      const response = await client.delete(path);
      const data = await getDataFromResponse(response, target, propertyKey);

      args = appendResponseToArgs(data, args, target, propertyKey);

      return method.apply(target, args);
    };
  };
}