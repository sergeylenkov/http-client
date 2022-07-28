import 'reflect-metadata';
import { Http, Header } from '../src/decorators';
import { HttpHeader } from '../src/headers';
import {
  HTTP_CLIENT_META_DATA,
  HEADER_META_DATA
} from '../src/constants';

@Http('https://gorest.co.in/public/v2')
@Header(HttpHeader.Authorization, 'test')
class TestClass {

}

describe('Decorators', () => {
  test('Http', () => {
    const client = Reflect.getMetadata(HTTP_CLIENT_META_DATA, global);

    expect(client).toBeDefined();
  });

  test('Header', () => {
    const testClass = new TestClass();

    const header = Reflect.getMetadata(HEADER_META_DATA, testClass);

    expect(header.has(HttpHeader.Authorization)).toBe(true);
    expect(header.get(HttpHeader.Authorization)).toBe('test');
  });
});