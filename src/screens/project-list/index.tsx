import React from "react";
import { SearchPanel } from "./search-panel";
import { List, Project } from "./list";
import { useEffect, useState } from "react";
import qs from "qs";
import {
  cleanObject,
  useDebounce,
  useDocumentTitle,
  useMount,
} from "../../utils";
import { useHttp } from "../../utils/http";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { useAsync } from "../../utils/use-async";
import { useProject } from "../../utils/project";
import { useUsers } from "../../utils/user";
import { useUrlQueryParam } from "../../utils/url";
import { useProjectModal, useProjectsSearchParams } from "./utils";
import { ButtonNoPadding, ErrorBox, Row } from "components/lib";

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const { open } = useProjectModal();
  const [param, setParam] = useProjectsSearchParams();
  const { isLoading, error, data: list } = useProject(useDebounce(param, 2000)); //传入cleanObject(debouncedParam)会不停渲染，是否因为新对象？
  const { data: users } = useUsers();

  useDocumentTitle("项目列表", false);

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding onClick={open} type="link">
          创建项目
        </ButtonNoPadding>{" "}
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List users={users || []} dataSource={list || []} loading={isLoading} />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = false;
// true时追踪该组件

const Container = styled.div`
  padding: 3.2rem;
`;
