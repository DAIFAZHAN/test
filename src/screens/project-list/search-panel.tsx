// /** @jsx jsx */ 与react17冲突
/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Input } from "antd";
import { UserSelect } from "components/user-selest";
import { Project } from "../../types/project";
import { User } from "../../types/user";

interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;

  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form css={{ marginBottom: "2rem", ">*": "" }} layout={"inline"}>
      <Form.Item>
        <Input
          placeholder={"项目名"}
          value={param.name}
          onChange={(evt) => {
            setParam({
              ...param,
              name: evt.target.value,
            });
            // setParam(Object.assign({}, param, {name:evt.target.value}))
          }}
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(value) => {
            setParam({
              ...param,
              personId: value,
            });
          }}
        />
      </Form.Item>
    </Form>
  );
};
