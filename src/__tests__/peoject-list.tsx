// 配置 setupTests.js ，是运行集成测试所需要的
// useForm从es引的未经编译代码的话，运行集成测试会有问题
import React from "react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import fakeData from "./fake.json";
import { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppProviders } from "../context";
import { ProjectListScreen } from "../screens/project-list";
// testing-library从用户出发，而不是开发者角度。开发者角度涉及细节，class和id会经常变等。

// 看加载页面需要哪些api，然后进行mock
const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer(
  rest.get(`${apiUrl}/me`, (req, res, ctx) =>
    res(
      ctx.json({
        id: 1,
        name: "jack",
        token: "123",
      })
    )
  ),
  rest.get(`${apiUrl}/users`, (req, res, ctx) => res(ctx.json(fakeData.users))),
  rest.get(`${apiUrl}/projects`, (req, res, ctx) => {
    // 实现搜索功能
    const { name = "", personId = undefined } = Object.fromEntries(
      // 键值对转对象
      req.url.searchParams
    );
    const result = fakeData.projects.filter((project) => {
      return (
        project.name.includes(name) &&
        (personId ? project.personId === +personId : true)
      );
    });
    return res(ctx.json(result));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const waitTable = () =>
  waitFor(() => expect(screen.getByText("骑手管理")).toBeInTheDocument(), {
    timeout: 3000,
  });

test("项目列表显示正常", async () => {
  renderScreen(<ProjectListScreen />, { route: "/projects" });
  await waitTable(); // 一开始是异步要loading，所以等待
  expect(screen.getAllByRole("row").length).toBe(fakeData.projects.length + 1); // table的行数
});

// 跑在node不是浏览器，模拟不了输入搜索等，但可以如下进行测试
test("搜索项目", async () => {
  renderScreen(<ProjectListScreen />, { route: "/projects?name=骑手" });
  await waitTable();
  expect(screen.getAllByRole("row").length).toBe(2);
  expect(screen.getByText("骑手管理")).toBeInTheDocument();
});

export const renderScreen = (ui: ReactNode, { route = "/projects" } = {}) => {
  window.history.pushState({}, "Test Page", route); // render时路由

  return render(<AppProviders>{ui}</AppProviders>); // 测试的页面一般不会独立存在，此案例要被包裹
};
