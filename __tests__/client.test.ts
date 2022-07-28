import { Get, Post, Http, Param, Response, Body, Header, Delete } from '../src/decorators';
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

  @Get('users/:id')
  public async getUser(@Param('id') id?: number, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User> {
    return response as unknown as User;
  }

  @Post('users')
  public async createUser(@Body() user?: User, @Response(HttpResponseType.Json) response?: JSONObject): Promise<User> {
    return response as unknown as User;
  }

  @Delete('users/:id')
  public async deleteUser(@Param('id') id?: number): Promise<number | undefined> {
    return id;
  }
}

const api = new API();
let userId: number | undefined;

describe('API Client', () => {
  test('Get', async () => {
    const users = await api.getUsers();
    expect(users.length).toBeGreaterThan(1);
  });

  test('Post', async () => {
    const user = await api.createUser(newUser);

    userId = user.id;

    expect(user.id).toBeGreaterThan(1);
    expect(user.name).toBe(newUser.name);
  });

  test('Get by id', async () => {
    expect(userId).toBeDefined();

    const user = await api.getUser(userId);
    expect(user.id).toBe(userId);
  });

  test('Delete by id', async () => {
    expect(userId).toBeDefined();
    console.log(userId);
    const id = await api.deleteUser(userId);
    expect(id).toBe(userId);
  });
})
