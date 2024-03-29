import { useEffect, useState } from "react";
import { useAddTask } from "../../utils/task";
import { useProjectIdInUrl, useTasksQueryKey } from "./utils";
import { Card, Input } from "antd";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const projectId = useProjectIdInUrl();
  const [inputMode, setInputMode] = useState(false);

  const submit = async () => {
    await addTask({
      // projectId,
      name,
      kanbanId,
    });
    setInputMode(false);
    setName("");
  };

  const toggle = () => setInputMode(!inputMode);

  useEffect(() => {
    if (!inputMode) {
      setName("");
    }
  }, [inputMode]);

  if (!inputMode) {
    return (
      <div onClick={toggle} style={{ cursor: "pointer" }}>
        +创建事务
      </div>
    );
  }

  return (
    <Card>
      <Input
        placeholder={"需要做些什么？"}
        onBlur={toggle}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  );
};
