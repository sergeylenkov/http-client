import 'reflect-metadata';
import { Http, Header, Get, Param, Body, Response, Query } from '../src/decorators';
import { HttpHeader } from '../src/headers';
import {
  HEADER_META_DATA,
  PATH_PARAM_META_DATA,
  BODY_META_DATA,
  RESPONSE_META_DATA,
  RESPONSE_TYPE_META_DATA,
  QUERY_META_DATA
} from '../src/constants';
import { HttpResponseType, JSONObject } from '../src/types';

@Http('https://test.com/api/v1')
@Header(HttpHeader.Authorization, 'test')
class TestClass {
  @Get('users')
  public testMethod(
    @Param('id') param: number,
    @Body() user?: JSONObject,
    @Response(HttpResponseType.Json) response?: JSONObject,
    @Query() query?: JSONObject | string
    ):void {
  }
}

let testClass: TestClass;

describe('Decorators', () => {
  beforeAll(() => {
    testClass = new TestClass();
  })

  test('Http', () => {
    const client = (testClass as any).__HTTP_CLIENT__;
    expect(client).toBeDefined();
  });

  test('Header', () => {
    const header = Reflect.getMetadata(HEADER_META_DATA, testClass);

    expect(header.has(HttpHeader.Authorization)).toBe(true);
    expect(header.get(HttpHeader.Authorization)).toBe('test');
  });

  test('Param', () => {
    const params: Map<string, number> = Reflect.getMetadata(PATH_PARAM_META_DATA, testClass, 'testMethod');

    expect(params.has('id')).toBe(true);
    expect(params.get('id')).toBe(0);
  });

  test('Body', () => {
    const index: number = Reflect.getMetadata(BODY_META_DATA, testClass, 'testMethod');

    expect(index).toBe(1);
  });

  test('Response', () => {
    const index: number = Reflect.getMetadata(RESPONSE_META_DATA, testClass, 'testMethod');
    const type: number = Reflect.getMetadata(RESPONSE_TYPE_META_DATA, testClass, 'testMethod');

    expect(index).toBe(2);
    expect(type).toBe(HttpResponseType.Json);
  });

  test('Query', () => {
    const index: number = Reflect.getMetadata(QUERY_META_DATA, testClass, 'testMethod');

    expect(index).toBe(3);
  });
});