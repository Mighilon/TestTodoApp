import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { CardProps } from "../types";
import { Plus, Trash2 } from "lucide-react";
import Task from "./Task";
import DropdownMenu from "./DropdownMenu";
import { useBoardContext } from "./BoardContext";
import { useEffect, useRef, useState } from "react";

export default function Card({ id, title, taskIds, tasks }: CardProps) {
  const {
    handleDeleteCard,
    handleRenameCard,
    handleAddTask,
    handleDeleteTask,
    activeItemId,
  } = useBoardContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      handleRenameCard(id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    willChange: "transform",
  };

  return (
    <div style={style} ref={setNodeRef} className="py-3">
      <div className="p-3 bg-white rounded-xl ">
        <div className="flex justify-between font-semibold mb-3 ">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              rows={1}
              className="pl-1 focus:border-none content-center row-auto focus:outline-none resize-none overflow-hidden break-all"
            />
          ) : (
            <div
              {...listeners}
              {...attributes}
              onDoubleClick={handleDoubleClick}
              className="touch-none select-none md:select-all pl-1 cursor-pointer content-center whitespace-pre-wrap"
            >
              {title}
            </div>
          )}
          <DropdownMenu
            className="content-center"
            options={[
              {
                label: "Delete",
                onClick: () => handleDeleteCard(id),
                danger: true,
              },
            ]}
          />
        </div>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="min-h-10">
            {taskIds.map((taskId) => (
              <Task
                key={taskId}
                id={taskId}
                content={tasks[taskId].content}
                completed={tasks[taskId].completed}
              />
            ))}
          </div>
        </SortableContext>
        <div className="mt-2 flex justify-end gap-2 mr-1.5">
          {taskIds.some((id) => activeItemId === id) && (
            <Trash2
              className="text-red-400"
              onClick={() => {
                if (activeItemId != null) handleDeleteTask(activeItemId);
              }}
            />
          )}
          <Plus className="text-gray-400" onClick={() => handleAddTask(id)} />
        </div>
      </div>
    </div>
  );
}
