import React from "react";
import { Form, Input, Select } from "antd";

export interface User {
  token: string;
  name: string;
  id: string;
  email: string;
  title: string;
  organization: string;
}

interface SearchPanelProps {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form action="">
      <Input
        value={param.name}
        onChange={(evt) => {
          setParam({
            ...param,
            name: evt.target.value,
          });
          // setParam(Object.assign({}, param, {name:evt.target.value}))
        }}
      />
      <Select
        value={param.personId}
        onChange={(value) => {
          setParam({
            ...param,
            personId: value,
          });
        }}
      >
        <Select.Option value="">负责人</Select.Option>
        {users.map((user) => (
          <Select.Option value={user.id} key={user.id}>
            {user.name}
          </Select.Option>
        ))}
      </Select>
    </Form>
  );
};
