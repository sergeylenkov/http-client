import 'reflect-metadata';
import { HttpClient } from './client';
import {
  HTTP_CLIENT_META_DATA,
  PATH_PARAM_META_DATA,
  RESPONSE_META_DATA,
  RESPONSE_TYPE_META_DATA,
} from './constants';
import { Dictionary } from './types';

export const enum ResponseType {
  Json,
  Text
}

export function Http(url: string): ClassDecorator {
  return (constructor: any) => {
    const client: HttpClient = new HttpClient(url);
    Reflect.defineMetadata(HTTP_CLIENT_META_DATA, client, global);
  };
}

export function Response(type?: ResponseType ): ParameterDecorator {
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
    const paths: Dictionary<number> = Reflect.getOwnMetadata(
      PATH_PARAM_META_DATA,
      target,
      propertyKey
    ) || {};

    paths[name] = parameterIndex;

    Reflect.defineMetadata(PATH_PARAM_META_DATA, paths, target, propertyKey);
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
      const reponseIndex: number = Reflect.getOwnMetadata(
        RESPONSE_META_DATA,
        target,
        propertyKey
      );

      const responseType: ResponseType = Reflect.getOwnMetadata(
        RESPONSE_TYPE_META_DATA,
        target,
        propertyKey
      );


      const paths: Dictionary<number> = Reflect.getOwnMetadata(
        PATH_PARAM_META_DATA,
        target,
        propertyKey
      );

      for (const key in paths) {
        const index = paths[key];
        const value = args[index];
        const param = `:${key}`;

        path = path.replace(param, value);
      }

      const client = Reflect.getMetadata(HTTP_CLIENT_META_DATA, global);

      const response = await client.get(path);
      let data;

      if (responseType === ResponseType.Json) {
        data = await response.json();
      } else if (responseType === ResponseType.Text) {
        data = await response.text();
      }

      if (reponseIndex >= 0) {
        args.splice(reponseIndex, 1, data);
      }

      return method.apply(target, args);
    };
  };
}
