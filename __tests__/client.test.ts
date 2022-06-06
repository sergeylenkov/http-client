import { HttpClient } from '../src/client';
import { Get, Http, Param, Response, ResponseType } from '../src/decorators';
import { JSONObject } from '../src/types';

@Http('https://gorest.co.in/public/v2')
class API extends HttpClient {
  @Get('users')
  public getUsers(@Response(ResponseType.Json) response?: JSONObject) {
    console.log(response);
  }

  @Get('users/:id')
  public getUser(@Param('id') id?: number, @Response(ResponseType.Json) response?: JSONObject) {
    console.log(id, response);
  }
}

const api = new API('');

test('Get', async () => {
  await api.getUsers();
});

test('Get with params', () => {
  //api.getUser(9);
});