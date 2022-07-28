import { Get, Post, Http, Param, Response, Body, Header } from '../src/decorators';
import { HttpHeader } from '../src/headers';
import { JSONObject, HttpResponseType } from '../src/types';

const token = process.env.TEST_API_TOKEN;
console.log(process.env.TEST_API_TOKEN);
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
}

const api = new API();

test('Get', async () => {
  const users = await api.getUsers();
  expect(users.length).toBeGreaterThan(1);
});

test('Get with params', async () => {
  const user = await api.getUser(9);
  expect(user.id).toBe(9);
});

test('Post', async () => {
    const user = await api.createUser(newUser);

    expect(user.id).toBeGreaterThan(1);
    expect(user.name).toBe(newUser.name);
});