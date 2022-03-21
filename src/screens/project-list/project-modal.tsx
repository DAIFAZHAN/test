import { Button, Drawer } from "antd";
import { useProjectModal } from "./utils";

export const ProjectModal = () => {
  const { ProjectModalOpen, close } = useProjectModal();
  return (
    <Drawer onClose={close} visible={ProjectModalOpen} width={"100%"}>
      <h1>Project Modal</h1>
      <Button onClick={close}>关闭</Button>
    </Drawer>
  );
};
