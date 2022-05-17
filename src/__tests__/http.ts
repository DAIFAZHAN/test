// 单元测试函数
import { setupServer } from "msw/node";
import { rest } from "msw";
// 前两项用于模拟异步http请求，因为mock里隔离外部环境，不能真正发请求
// msw 用来mock服务器数据
// 不用json-server是因为不想在本地起一个真的服务器，msw是专门用来单元测试的mock的
import { http } from "../utils/http";

// 传统单元测试：

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer(); //在 NodeJS 环境中设置请求拦截层的函数。

// jest 是对react最友好的一个测试库，主要用来单元测试
// beforeAll 代表执行所有的测试之前，先来执行一下回调函数
beforeAll(() => server.listen());
// listen() :Establishes a request interception instance previously configured via setupServer.

// 每一个测试跑完之后，都重置mock路由
afterEach(() => server.resetHandlers());

// 所有的测试跑完后，关闭mock路由
afterAll(() => server.close());

test("http方法发送异步请求", async () => {
  const endpoint = "test-endpoint"; // 要请求的地址
  const mockResult = { mockValue: "mock" }; // mock 要返回的值

  // use() :将给定的请求处理程序添加到当前服务器实例。runtime request handler.
  server.use(
    // rest命名空间包含一组请求处理程序，旨在方便地模拟REST API 请求。
    // 使用此命名空间下的方法会自动创建一个请求处理程序，该处理程序将任何请求与相应的 REST API 方法匹配。
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) =>
      res(ctx.json(mockResult))
    ) // 注意 return 的是res
  );
  const result = await http(endpoint);
  expect(result).toEqual(mockResult); // toEqual 用于对比对象等，toBe 对比严格相等
});

test("http请求时会在header带上token", async () => {
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };
  const token = "FAKE_TOKEN";

  let request: any;
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
});
