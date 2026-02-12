import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./Column";
import rawData from "../data/data.json";
import type {
  CardId,
  Column as ColumnType,
  TaskId,
  BoardState,
} from "../types";

export default function Board() {
  const [state, setState] = useState<BoardState>(() => rawData as BoardState);

  type ActiveItemType = {
    type: "card" | "task";
    cardId?: CardId;
    taskId?: TaskId;
  };

  const [activeItemId, setActiveItemId] = useState<ActiveItemType | null>();
  const sensors = useSensors(useSensor(PointerSensor));

  // Helper to find which column contains a card
  const findContainerCard = (prev: BoardState, cardId: CardId) => {
    // Check if id is a column
    if (Object.keys(prev.columns).includes(cardId)) {
      return cardId;
    }
    // Find column containing the card
    return Object.keys(prev.columns).find((columnId) =>
      prev.columns[columnId].cardIds.includes(cardId),
    );
  };

  // Helper to find which column contains a task
  const findContainerTask = (prev: BoardState, taskId: TaskId) => {
    // Check if id is a card
    if (Object.keys(prev.cards).includes(taskId)) {
      return taskId;
    }
    // Find column containing the task
    return Object.keys(prev.cards).find((cardId) =>
      prev.cards[cardId].taskIds.includes(taskId),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id.toString();
    if (id.startsWith("card")) {
      setActiveItemId({ type: "card", cardId: id });
    } else {
      setActiveItemId({ type: "task", taskId: id });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (activeItemId === undefined) {
      console.log("Undefined: activeId");
      return;
    }

    const { active, over } = event;
    if (!over || !activeItemId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeItemId.type === "card") {
      handleDragOverCard(activeId, overId);
    } else if (activeItemId.type === "task") {
      handleDragOverTask(activeId, overId);
    } else {
      console.log("Unknown: activeId.type");
    }
  };

  const handleDragOverCard = (activeId: string, overId: string) => {
    setState((prev) => {
      // console.log(`ActiveId:${activeId}; OverId:${overId}`);
      const activeCol = findContainerCard(prev, activeId);
      const overCol = findContainerCard(prev, overId);
      // console.log(`ActiveCol:${activeCol}; OverCol:${overCol}`);

      if (!activeCol || !overCol || activeCol === overCol) return prev;

      const activeCards = prev.columns[activeCol].cardIds;
      const overCards = prev.columns[overCol].cardIds;
      const activeIndex = activeCards.indexOf(activeId);
      const overIndex = overCards.indexOf(overId);

      const newIndex =
        overId in prev.columns
          ? overCards.length
          : overIndex >= 0
            ? overIndex
            : overCards.length;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [activeCol]: {
            ...prev.columns[activeCol],
            cardIds: activeCards.filter((id) => id !== activeId),
          },
          [overCol]: {
            ...prev.columns[overCol],
            cardIds: [
              ...overCards.slice(0, newIndex),
              activeId,
              ...overCards.slice(newIndex),
            ],
          },
        },
      };
    });
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItemId(null);

    if (!over || !activeItemId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeItemId.type === "card") {
      handleCardDragEnd(activeId, overId);
    } else if (activeItemId.type === "task") {
      handleTaskDragEnd(activeId, overId);
    }
  }

  function handleCardDragEnd(activeId: string, overId: string) {
    setState((prev) => {
      const activeCol = findContainerCard(prev, activeId);
      const overCol = findContainerCard(prev, overId);

      if (!activeCol || !overCol || activeCol !== overCol) return prev;

      const cards = prev.columns[activeCol].cardIds;
      const oldIndex = cards.indexOf(activeId);
      const newIndex = cards.indexOf(overId);

      if (oldIndex === newIndex) return prev;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [activeCol]: {
            ...prev.columns[activeCol],
            cardIds: arrayMove(cards, oldIndex, newIndex),
          },
        },
      };
    });
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* <h1 className="flex justify-center">Kanban Board</h1> */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-center gap-6">
          {state.columnOrder.map((columnId) => {
            return (
              <Column
                id={columnId}
                title={state.columns[columnId].title}
                cardIds={state.columns[columnId].cardIds}
                cards={state.cards}
                tasks={state.tasks}
              ></Column>
            );
          })}
        </div>

        <DragOverlay>
          {activeItemId === null || activeItemId === undefined ? (
            <></>
          ) : activeItemId.type === "card" ? (
            <div className="p-3 bg-white rounded-xl cursor-grab shadow-md/20">
              Test
            </div>
          ) : (
            <></>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
