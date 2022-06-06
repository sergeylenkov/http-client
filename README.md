# http-client
Small TypesScript http client based on decorators

![build lib workflow](https://github.com/sergeylenkov/http-client/actions/workflows/github-actions.yml/badge.svg)

## How it works

Declare class

```
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
```

Make request

```
const api = new API();

const users = await api.getUsers();
const user = await api.getUser(9);
```