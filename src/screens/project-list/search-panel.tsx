import React from "react";

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
  console.log("SearchPanel");
  return (
    <form action="">
      <input
        value={param.name}
        onChange={(evt) => {
          setParam({
            ...param,
            name: evt.target.value,
          });
          // setParam(Object.assign({}, param, {name:evt.target.value}))
        }}
      />
      <select
        value={param.personId}
        onChange={(evt) => {
          setParam({
            ...param,
            personId: evt.target.value,
          });
        }}
      >
        <option value="">负责人</option>
        {users.map((user) => (
          <option value={user.id} key={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </form>
  );
};
