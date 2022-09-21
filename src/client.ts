import {
  isSuccessful,
  isClientError,
  isServerError,
  isAuthError,
} from './statuses';
import {
  HttpClientException,
  HttpNetworkException,
  HttpServerException,
  HttpUnknowException,
  HttpAuthorizationException,
  HttpException,
} from './exceptions';
import { Dictionary, JSONObject } from './types';

type BodyType = JSONObject | string | FormData;

export class HttpClient {
  private _url: string;
  private _headers: Map<string, string>;

  constructor(url: string) {
    this._url = url;
    this._headers = new Map();
  }

  public setHeader(key: string, value: string): void {
    this._headers.set(key, value);
  }

  private getHeaders(): HeadersInit {
    return Object.fromEntries(this._headers);
  }

  private async request(url: string, request: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, request);

      if (isSuccessful(response.status)) {
        return response;
      } else if (isAuthError(response.status)) {
        throw new HttpAuthorizationException(
          response.status,
          response.statusText,
          response
        );
      } else if (isClientError(response.status)) {
        throw new HttpClientException(
          response.status,
          response.statusText,
          response
        );
      } else if (isServerError(response.status)) {
        throw new HttpServerException(
          response.status,
          response.statusText,
          response
        );
      }

      throw new HttpUnknowException(
        response.status,
        response.statusText,
        response
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpNetworkException(0, 'Network error');
      }
    }
  }

  public async get(
    path: string,
    params?: Dictionary<string>
  ): Promise<Response> {
    const request: RequestInit = {
      method: 'GET',
      headers: this.getHeaders(),
    };

    let queryParams = '';

    if (params) {
      queryParams = '?';

      Object.keys(params).forEach((key) => {
        queryParams = queryParams + `${key}=${params[key]}&`;
      });

      queryParams = queryParams.slice(0, -1);
    }

    return this.request(`${this._url}/${path}${queryParams}`, request);
  }

  public async post(path: string, body: BodyType): Promise<Response> {
    const request: RequestInit = {
      method: 'POST',
      headers: this.getHeaders(),
      body: getBody(body)
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public async put(path: string, body: any): Promise<Response> {
    const request: RequestInit = {
      method: 'PUT',
      headers: this.getHeaders(),
      body: getBody(body)
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public async patch(path: string, body: BodyType): Promise<Response> {
    const request: RequestInit = {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: getBody(body)
    };

    return this.request(`${this._url}/${path}`, request);
  }

  public delete(path: string): Promise<Response> {
    const request: RequestInit = {
      method: 'DELETE',
      headers: this.getHeaders(),
    };

    return this.request(`${this._url}/${path}`, request);
  }
}

function getBody(value: BodyType): BodyInit {
  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
}