import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { CardProps } from "../types";
import { EllipsisVertical } from "lucide-react";

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
    willChange: "transform",
  };

  return (
    <div style={style} ref={setNodeRef} className="py-3">
      <div className="p-3 bg-white rounded-xl shadow-md/20">
        <div className="flex justify-between font-semibold">
          <div {...listeners} {...attributes} className="pl-1 cursor-grab">
            {content}
          </div>
          <EllipsisVertical className="text-[#9BA0A4]" />
        </div>
        <div>TEST</div>
      </div>
    </div>
  );
}
