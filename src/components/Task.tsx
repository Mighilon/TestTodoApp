import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { TaskProps } from "../types";
import { Check } from "lucide-react";
import { useBoardContext } from "./BoardContext";
import { useEffect, useRef, useState } from "react";
import Glass from "./Glass";

export default function Task({ id, content, completed }: TaskProps) {
  const {
    activeItemId,
    setActiveItemId,
    handleTaskChangeState,
    handleTaskChangeContent,
  } = useBoardContext();

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

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditContent(content);
  };

  const handleSave = () => {
    if (editContent.trim()) {
      handleTaskChangeContent(id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditContent(content);
      setIsEditing(false);
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);
  return (
    <div style={style} ref={setNodeRef} className="py-0.5">
      <Glass
        rounded="rounded-md"
        className={`bg-[#EDF4FC]/0 p-1.5 border border-white/0 rounded-md flex justify-between items-center pr-2 ${activeItemId === id && "outline-2 outline-slate-300"}`}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => {
              setEditContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={1}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="focus:border-none row-auto focus:outline-none resize-none overflow-hidden break-all"
            autoFocus
          />
        ) : (
          <div
            {...listeners}
            {...attributes}
            onDoubleClick={() => {
              setActiveItemId(id);
              handleDoubleClick();
            }}
            className="cursor-pointer w-full break-all"
          >
            {content}
          </div>
        )}
        <Check
          onClick={() => handleTaskChangeState(id)}
          className={`ml-0.5 text-white text-lg ${completed ? "bg-[#68BB57]" : "bg-slate-300"} cursor-pointer rounded-full p-1 min-w-5`}
          size={20}
          strokeWidth={5}
          absoluteStrokeWidth
        />
      </Glass>
    </div>
  );
}
