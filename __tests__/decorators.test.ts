import 'reflect-metadata';
import { Header, Get, Param, Body, Response, Query, RequestHeader, Post, Patch, Delete, Cache, BaseUrl } from '../src/decorators';
import { HttpHeader } from '../src/headers';
import {
  HEADER_META_DATA,
  PATH_PARAM_META_DATA,
  BODY_META_DATA,
  RESPONSE_META_DATA,
  RESPONSE_TYPE_META_DATA,
  QUERY_META_DATA,
  HEADER_REQUEST_META_DATA,
  PATH_META_DATA,
  CACHE_META_DATA
} from '../src/constants';
import { HttpResponseType, JSONObject } from '../src/types';
import { HttpClient } from '../src/client';

@BaseUrl('https://test.com/api/v1')
@Header(HttpHeader.Authorization, 'test')
class TestClass extends HttpClient {
  @Get('users')
  @RequestHeader(HttpHeader.ContentType, 'application/json')
  public getMethod(
    @Param('id') param: number,
    @Body() user?: JSONObject,
    @Response(HttpResponseType.Json) response?: JSONObject,
    @Query() query?: JSONObject | string
    ):void {
  }

  @Post('users')
  public postMethod() {}

  @Patch('users')
  public patchMethod() {}

  @Delete('users')
  public deleteMethod() {}

  @Cache(100)
  public cacheMethod() {}
}

let testClass: TestClass;

describe('Decorators', () => {
  beforeAll(() => {
    testClass = new TestClass();
  })

  test('Header', () => {
    const headers = Reflect.getMetadata(HEADER_META_DATA, testClass);

    expect(headers.has(HttpHeader.Authorization)).toBe(true);
    expect(headers.get(HttpHeader.Authorization)).toBe('test');
  });

  test('Param', () => {
    const params: Map<string, number> = Reflect.getMetadata(PATH_PARAM_META_DATA, testClass, 'getMethod');

    expect(params.has('id')).toBe(true);
    expect(params.get('id')).toBe(0);
  });

  test('Body', () => {
    const index: number = Reflect.getMetadata(BODY_META_DATA, testClass, 'getMethod');

    expect(index).toBe(1);
  });

  test('Response', () => {
    const index: number = Reflect.getMetadata(RESPONSE_META_DATA, testClass, 'getMethod');
    const type: number = Reflect.getMetadata(RESPONSE_TYPE_META_DATA, testClass, 'getMethod');

    expect(index).toBe(2);
    expect(type).toBe(HttpResponseType.Json);
  });

  test('Query', () => {
    const index: number = Reflect.getMetadata(QUERY_META_DATA, testClass, 'getMethod');

    expect(index).toBe(3);
  });

  test('RequestHeader', () => {
    const headers = Reflect.getMetadata(HEADER_REQUEST_META_DATA, testClass, 'getMethod');

    expect(headers.has(HttpHeader.ContentType)).toBe(true);
    expect(headers.get(HttpHeader.ContentType)).toBe('application/json');
  });

  test('Get', () => {
    const path: string = Reflect.getMetadata(PATH_META_DATA, testClass, 'getMethod');

    expect(path).toBe('users');
  });

  test('Post', () => {
    const path: string = Reflect.getMetadata(PATH_META_DATA, testClass, 'postMethod');

    expect(path).toBe('users');
  });

  test('Patch', () => {
    const path: string = Reflect.getMetadata(PATH_META_DATA, testClass, 'patchMethod');

    expect(path).toBe('users');
  });

  test('Delete', () => {
    const path: string = Reflect.getMetadata(PATH_META_DATA, testClass, 'deleteMethod');

    expect(path).toBe('users');
  });

  test('LocalCache', () => {
    const lifegime: number = Reflect.getMetadata(CACHE_META_DATA, testClass, 'cacheMethod');

    expect(lifegime).toBe(100);
  });
});