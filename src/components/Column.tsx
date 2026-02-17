import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { ColumnProps } from "../types/index.ts";
import Card from "./Card.tsx";

export default function Column({
  id,
  title,
  cardIds,
  cards,
  tasks,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="min-h-75 w-60 rounded-2">
      <h3 className="text-center tracking-widest uppercase font-medium mb-4">
        {title}
      </h3>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="min-h-150">
          {cardIds.map((cardId) => (
            <Card
              key={cardId}
              id={cardId}
              title={cards[cardId].title}
              taskIds={cards[cardId].taskIds}
              tasks={tasks}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
