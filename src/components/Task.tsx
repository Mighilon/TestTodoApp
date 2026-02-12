import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { TaskProps } from "../types";

export default function Task({ id, content }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    willChange: "transform",
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className=" bg-indigo-100 p-1 border border-white"
    >
      <div {...listeners} {...attributes} className="cursor-grab">
        {content}
      </div>
    </div>
  );
}
