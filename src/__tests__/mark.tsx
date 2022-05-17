import React from "react";
import { render, screen } from "@testing-library/react";
import { Mark } from "../components/mark";

// jest是一个框架，test、expect、expect.any等是jest的东西，但归根结底还是测试js的
// 所以要用testing-libraty

test("Mark 组件正确高亮关键词", () => {
  const name = "物料管理";
  const keyword = "管理";
  render(<Mark name={name} keyword={keyword} />); // render组件到screen

  expect(screen.getByText(keyword)).toBeInTheDocument(); // 找关键词所在的dom元素在doc里
  expect(screen.getByText(keyword)).toHaveStyle("color:#257AFD");
  expect(screen.getByText("物料")).not.toHaveStyle("color:#257AFD");
});
