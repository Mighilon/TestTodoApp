import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { ColumnProps } from "../types/index.ts";
import Card from "./Card.tsx";

export default function Column({ id, title, items }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const style = {
    minHeight: "300px",
    width: "250px",
    // padding: "15px",
    // backgroundColor: isOver ? "#f0f0f0" : "#fafafa",
    // backgroundColor: "#fafafa",
    // border: "2px solid",
    // borderColor: isOver ? "#4CAF50" : "#e0e0e0",
    // borderColor: "#e0e0e0",
    borderRadius: "8px",
  };
  return (
    <div ref={setNodeRef} style={style}>
      <h3 className="text-center tracking-widest uppercase font-medium mb-4">
        {title}
      </h3>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-50">
          {items.map((item) => (
            <Card key={item.id} id={item.id} content={item.content} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
