import { Get, Post, Http, Param, Response, Body, Header, Delete, Patch, Query } from '../src/decorators';
import { HttpHeader } from '../src/headers';
import { JSONObject, HttpResponseType, Dictionary } from '../src/types';
import fetchMock, { FetchMock } from 'jest-fetch-mock';

import usersJson from './mocks/users.json';
import userJson from './mocks/user.json';
import { HttpClientException, HttpException, HttpServerException } from '../src/exceptions';
import { HttpStatus } from '../src/statuses';

const token = process.env.TEST_API_TOKEN;

interface User {
  id?: number;
  name: string;
  email: string;
  gender: 'male' | 'female',
  status: 'active' | 'inactive';
}

const newUser: User = {
  name: 'Sergey Lenkov',
  email: 'sergey@sergeylenkov.ru',
  gender: 'male',
  status: 'active'
}

@Http('https://test.com/api/v1')
@Header(HttpHeader.Authorization, `Bearer ${token}`)
@Header(HttpHeader.ContentType, 'application/json')
class API {
  @Get('users')
  public async getUsers(@Response(HttpResponseType.Json) response?: JSONObject): Promise<User[]> {
    return response as unknown as User[];
  }

  @Get('users')
  public async getUsersByPage(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User[]> {
    return response as unknown as User[];
  }

  @Get('users')
  public async getUsersByPage2(@Query() query?: JSONObject | string, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User[]> {
    return response as unknown as User[];
  }

  @Get('users/:id')
  public async getUser(@Param('id') id?: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User> {
    return response as unknown as User;
  }

  @Post('users')
  public async createUser(@Body() user?: User, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User> {
    return response as unknown as User;
  }

  @Patch('users/:id')
  public async changeUser(@Param('id') id?: number, @Body() user?: User, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User> {
    return response as unknown as User;
  }

  @Delete('users/:id')
  public async deleteUser(@Param('id') id?: number): Promise<number | undefined> {
    return id;
  }
}

const api = new API();

describe('API Client', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  })

  test('Headers', async () => {
    fetchMock.mockResponse(JSON.stringify(usersJson));

    const users = await api.getUsers();
    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);
    const headers: Dictionary<string> = options.headers as Dictionary<string>;

    expect(url).toBe('https://test.com/api/v1/users');
    expect(options.method).toBe('GET');
    expect(headers[HttpHeader.ContentType]).toBe('application/json');
    expect(headers[HttpHeader.Authorization]).toBe(`Bearer ${token}`);
    expect(users.length).toBe(10);
  });

  test('Get', async () => {
    fetchMock.mockResponse(JSON.stringify(usersJson));

    const users = await api.getUsers();
    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users');
    expect(options.method).toBe('GET');

    expect(users.length).toBe(10);
  });

  test('Get with query as string', async () => {
    fetchMock.mockResponse(JSON.stringify(usersJson));

    const users = await api.getUsersByPage('page=1');
    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users?page=1');
    expect(options.method).toBe('GET');

    expect(users.length).toBe(10);
  });

  test('Get with query as object', async () => {
    fetchMock.mockResponse(JSON.stringify(usersJson));

    const users = await api.getUsersByPage2({ page: 1 });
    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users?page=1');
    expect(options.method).toBe('GET');

    expect(users.length).toBe(10);
  });

  test('Get by id', async () => {
    fetchMock.mockResponse(JSON.stringify({...usersJson, id: 1000 }));

    let user = await api.getUser(1000);
    let url = getFetchUrl(fetchMock);
    let options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users/1000');
    expect(options.method).toBe('GET');
    expect(user.id).toBe(1000);

    fetchMock.mockResponse(JSON.stringify({...usersJson, id: 2000 }));

    user = await api.getUser(2000);
    url = getFetchUrl(fetchMock, 1);
    options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users/2000');
    expect(options.method).toBe('GET');
    expect(user.id).toBe(2000);
  });

  test('Post', async () => {
    fetchMock.mockResponse(JSON.stringify(userJson));

    const user = await api.createUser(userJson as User);
    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users');
    expect(options.method).toBe('POST');
    expect(user.id).toBe(9999);
    expect(user.name).toBe(newUser.name);
  });

  test('Patch by id', async () => {
    fetchMock.mockResponse(JSON.stringify(userJson));

    const user = await api.changeUser(userJson.id, userJson as User);
    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users/9999');
    expect(options.method).toBe('PATCH');
    expect(user.id).toBe(9999);
  });

  test('Delete by id', async () => {
    fetchMock.mockResponse(JSON.stringify(9999));
    const id = await api.deleteUser(9999);

    const url = getFetchUrl(fetchMock);
    const options = getFetchOptions(fetchMock);

    expect(url).toBe('https://test.com/api/v1/users/9999');
    expect(options.method).toBe('DELETE');
    expect(id).toBe(9999);
  });

  test('404', async () => {
    fetchMock.mockResponse(JSON.stringify(9999), { status: 404 });

    try {
      const id = await api.getUser(9999);
    } catch (error) {
      expect(error instanceof HttpClientException).toBe(true);
      expect((error as HttpException).status).toBe(404);
    }
  });

  test('500', async () => {
    fetchMock.mockResponse(JSON.stringify(9999), { status: 500 });

    try {
      const id = await api.getUser(9999);
    } catch (error) {
      expect(error instanceof HttpServerException).toBe(true);
      expect((error as HttpException).status).toBe(500);
    }
  });
})

function getFetchUrl(fetchMock: FetchMock, callIndex: number = 0): string {
  return String(fetchMock.mock.calls[callIndex][0]);
}

function getFetchOptions(fetchMock: FetchMock): JSONObject {
  return fetchMock.mock.calls[0][1] as JSONObject;
}