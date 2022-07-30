import { Get, Post, Http, Param, Response, Body, Header, Delete, Patch, Query } from '../src/decorators';
import { HttpHeader } from '../src/headers';
import { JSONObject, HttpResponseType } from '../src/types';

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
  email: `${Date.now()}@gmail.com`,
  gender: 'male',
  status: 'active'
}

@Http('https://gorest.co.in/public/v2')
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
let testUser: User | undefined;

describe('API Client', () => {
  test('Get', async () => {
    const users = await api.getUsers();
    expect(users.length).toBeGreaterThan(1);
  });

  test('Get with query as string', async () => {
    const users = await api.getUsersByPage('page=1');
    expect(users.length).toBeGreaterThan(1);
  });

  test('Get with query as object', async () => {
    const users = await api.getUsersByPage({ page: 1 });
    expect(users.length).toBeGreaterThan(1);
  });

  test('Post', async () => {
    const user = await api.createUser(newUser);

    testUser = user;

    expect(user.id).toBeGreaterThan(1);
    expect(user.name).toBe(newUser.name);
  });

  test('Get by id', async () => {
    expect(testUser).toBeDefined();

    if (testUser) {
      const user = await api.getUser(testUser.id);
      expect(user.id).toBe(testUser.id);
    }
  });

  test('Patch by id', async () => {
    expect(testUser?.id).toBeDefined();

    if (testUser) {
      testUser.gender = 'female';

      const user = await api.changeUser(testUser.id, testUser);
      expect(user.gender).toBe(testUser.gender);
    }
  });

  test('Delete by id', async () => {
    expect(testUser).toBeDefined();

    if (testUser) {
      const id = await api.deleteUser(testUser.id);
      expect(id).toBe(testUser.id);
    }
  });
})
