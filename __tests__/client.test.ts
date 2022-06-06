import { HttpClient } from '../src/client';
import { Get, Http, Param, Response, ResponseType } from '../src/decorators';
import { JSONObject } from '../src/types';

interface User {
  id: number;
  name: string;
  email: string;
}

@Http('https://gorest.co.in/public/v2')
class API {
  @Get('users')
  public async getUsers(@Response(ResponseType.Json) response?: JSONObject): Promise<User[]> {
    return response as unknown as User[];
  }

  @Get('users/:id')
  public async getUser(@Param('id') id?: number, @Response(ResponseType.Json) response?: JSONObject): Promise<User> {
    return response as unknown as User;
  }
}

const api = new API();

test('Get', async () => {
  const users = await api.getUsers();
  expect(users.length).toBe(20);
});

test('Get with params', async () => {
  const user = await api.getUser(9);
  expect(user.id).toBe(9);
});