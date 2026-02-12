import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CardProps } from "../types";
import { EllipsisVertical } from "lucide-react";
import Task from "./Task";

export default function Card({ id, title, taskIds, tasks }: CardProps) {
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
    <div style={style} ref={setNodeRef} className="py-3">
      <div className="p-3 bg-white rounded-xl shadow-md/20">
        <div className="flex justify-between font-semibold mb-3">
          <div {...listeners} {...attributes} className="pl-1 cursor-grab">
            {title}
          </div>
          <EllipsisVertical className="text-[#9BA0A4]" size={20} />
        </div>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="min-h-50">
            {/* {items.map((item) => ( */}
            {/*   <Task key={item.id} id={item.id} content={item.content} /> */}
            {/* ))} */}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
