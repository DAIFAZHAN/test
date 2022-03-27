import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { useProjectModal } from "screens/project-list/utils";
import { useProjects } from "utils/project";
import { ButtonNoPadding } from "./lib";

export const ProjectPopover = () => {
  const { open } = useProjectModal();
  //用refetch解决：点星后只对["projects",{"name":""}]乐观更新，此处读取的还是["projects",null]，此时未及时更新
  const { data: projects, refetch } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);
  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding onClick={open} type="link">
        创建项目
      </ButtonNoPadding>{" "}
    </ContentContainer>
  );

  return (
    <Popover
      onVisibleChange={() => refetch()}
      placement="bottom"
      content={content}
    >
      项目
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
