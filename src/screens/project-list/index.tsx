import React from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useEffect, useState } from "react";
import qs from "qs";
import { cleanObject, useDebounce, useMount } from "../../utils";
import { useHttp } from "../../utils/http";

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: "",
    personId: "",
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const debouncedParam = useDebounce(param, 2000);

  const client = useHttp();

  // useEffect(() => {
  //   fetch(
  //       `${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`
  //   ).then(async (response) => {
  //     if (response.ok) {
  //       setList(await response.json());
  //     }
  //   });
  // }, [debouncedParam]);

  useEffect(() => {
    client("projects", { data: cleanObject(debouncedParam) }).then(setList);
  }, [debouncedParam]);

  // useMount(() => {
  //   fetch(`${apiUrl}/users`).then(async (response) => {
  //     if (response.ok) {
  //       setUsers(await response.json());
  //     }
  //   });
  // });

  useMount(() => {
    client("users").then(setUsers);
  });

  console.log("ProjectListScreen");
  return (
    <div>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  );
};
