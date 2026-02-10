import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { CardProps } from "../types";

export default function Card({ id, content }: CardProps) {
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
  };

  return (
    <div ref={setNodeRef} className="p-3 my-8 bg-white rounded-xl shadow-md/20">
      <div style={style} {...attributes} {...listeners} className="cursor-grab">
        {content}
      </div>
      <div className="min-h-5 bg-cyan-50"></div>
      <div className="min-h-5 bg-cyan-50"></div>
      <div className="min-h-5 bg-cyan-50"></div>
      <div className="min-h-5 bg-cyan-50"></div>
      <div className="min-h-5 bg-cyan-50"></div>
    </div>
  );
}
