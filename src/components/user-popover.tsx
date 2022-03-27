import styled from "@emotion/styled";
import { List, Popover, Typography } from "antd";
import { useUsers } from "../utils/user";

export const UserPopover = () => {
  //用refetch点星后只对["projects",{"name":""}]乐观更新，此处读取的还是["projects",null]，此时未及时更新
  const { data: users, refetch } = useUsers();
  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
    </ContentContainer>
  );

  return (
    <Popover
      onVisibleChange={() => refetch()}
      placement="bottom"
      content={content}
    >
      <span>组员</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
