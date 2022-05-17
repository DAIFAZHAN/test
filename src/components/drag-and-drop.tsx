import {
  Draggable,
  DraggableProps,
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableProvidedProps,
} from "react-beautiful-dnd";
import React, { ReactNode } from "react";

type DropProps = Omit<DroppableProps, "children"> & { children: ReactNode };
/**
 * 封装Droppable，配合DropChild
 * @param param0
 * @returns
 */
export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <Droppable {...props}>
      {(provided) => {
        //provided来自Droppable
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            //children接收来自Droppable的provided
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          }); // 克隆子元素，强制传入这些props
        }
        return <div />;
      }}
    </Droppable>
  );
};

type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HtmlHTMLAttributes<HTMLDivElement>;
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  // 第一个范型为返回标签类型
  // ref 转发，ref无法作为属性传递 // 定义的子组件属性未声明接收ref，需要用到该转发。
  // React.forwardRef 会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {props.provided?.placeholder}
      {/* placeholder计算剩的空间 */}
    </div>
  )
);

type DragProps = Omit<DraggableProps, "children"> & { children: ReactNode };
/**
 * 封装Draggable
 * @param param0
 * @returns
 */
export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        //provided来自Draggable
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            //children接收来自Draggable的provided
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          });
        }
        return <div />;
      }}
    </Draggable>
  );
};
