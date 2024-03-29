import React, { FormEvent } from "react";
import { useAuth } from "../context/auth-context";
import { Button, Form, Input } from "antd";
import styled from "@emotion/styled";
import { useAsync } from "../utils/use-async";

const apiUrl = process.env.REACT_APP_API_URL;

export const RegisterScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { register } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });

  const handleSubmit = async ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword !== values.password) {
      onError(new Error("请确认两次输入的密码相同"));
      return;
    }
    try {
      await run(register(values));
    } catch (e: any) {
      onError(e);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"username"}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        {/* <label htmlFor="username">用户名</label> */}
        <Input placeholder={"用户名"} type="text" id={"username"} />
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        {/*<label htmlFor={"password"}>密码</label>*/}
        <Input placeholder={"密码"} type={"password"} id={"password"} />
      </Form.Item>
      <Form.Item
        name={"cpassword"}
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input placeholder={"确认密码"} type={"password"} id={"cpassword"} />
      </Form.Item>
      <Form.Item>
        <RegisterButton
          loading={isLoading}
          htmlType={"submit"}
          type={"primary"}
        >
          注册
        </RegisterButton>
      </Form.Item>
    </Form>
  );
};

const RegisterButton = styled(Button)`
  width: 100%;
`;
