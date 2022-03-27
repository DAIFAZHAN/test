export const reorder = ({
  fromId,
  referenceId,
  type,
  list,
}: {
  fromId: number;
  referenceId: number;
  type: string;
  list: { id: number }[];
}) => {
  const copiedList = [...list];
  //找到fromId对应项目的下标
  const movingItemIndex = copiedList.findIndex((item) => item.id === fromId);

  if (!referenceId) {
    //如果插入到其他看板的最后空白处，直接放到整个数组最后，乐观更新时会更改此id的kanbanId
    return insertAfter([...copiedList], movingItemIndex, copiedList.length - 1);
  }
  const targetItemIndex = copiedList.findIndex(
    (item) => item.id === referenceId
  );
  const insert = type === "after" ? insertAfter : insertBefore;
  return insert([...copiedList], movingItemIndex, targetItemIndex);
};

function insertBefore(list: unknown[], from: number, to: number) {
  const toItem = list[to];
  const removedItem = list.splice(from, 1)[0];
  const toIndex = list.indexOf(toItem);
  list.splice(toIndex, 0, removedItem);
  return list;
}

function insertAfter(list: unknown[], from: number, to: number) {
  const toItem = list[to];
  const removedItem = list.splice(from, 1)[0];
  const toIndex = list.indexOf(toItem);
  list.splice(toIndex + 1, 0, removedItem);
  return list;
}
