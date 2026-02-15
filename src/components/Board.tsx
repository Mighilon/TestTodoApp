import { useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
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

  const [activeItemId, setActiveItemId] = useState<string | null>();
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
      setActiveItemId(id);
    } else {
      setActiveItemId(id);
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

    if (activeItemId.startsWith("card-")) {
      handleDragOverCard(activeId, overId);
    } else if (activeItemId.startsWith("task-")) {
      handleDragOverTask(activeId, overId);
    } else {
      console.log("Unknown: activeId.type");
    }
  };

  function handleDragOverTask(activeId: string, overId: string) {
    setState((prev) => {
      // console.log(`ActiveId:${activeId}; OverId:${overId}`);
      const activeCard = findContainerTask(prev, activeId);
      const overCard = findContainerTask(prev, overId);
      // console.log(`ActiveCard:${activeCard}; OverCard:${overCard}`);

      if (!activeCard || !overCard || activeCard === overCard) return prev;

      const activeTasks = prev.cards[activeCard].taskIds;
      const overTasks = prev.cards[overCard].taskIds;
      const activeIndex = activeTasks.indexOf(activeId);
      const overIndex = overTasks.indexOf(overId);

      const newIndex =
        overId in prev.cards
          ? overTasks.length
          : overIndex >= 0
            ? overIndex
            : overTasks.length;

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [activeCard]: {
            ...prev.cards[activeCard],
            taskIds: activeTasks.filter((id) => id !== activeId),
          },
          [overCard]: {
            ...prev.cards[overCard],
            taskIds: [
              ...overTasks.slice(0, newIndex),
              activeId,
              ...overTasks.slice(newIndex),
            ],
          },
        },
      };
    });
  }

  const handleDragOverCard = (activeId: string, overId: string) => {
    setState((prev) => {
      if (overId.startsWith("task")) {
        overId =
          Object.keys(prev.cards).find((cardId) =>
            prev.cards[cardId].taskIds.includes(overId),
          ) ?? overId;
      }
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

    if (activeItemId.startsWith("card-")) {
      handleCardDragEnd(activeId, overId);
    } else if (activeItemId.startsWith("task-")) {
      handleTaskDragEnd(activeId, overId);
    }
  }

  function handleCardDragEnd(activeId: string, overId: string) {
    setState((prev) => {
      if (overId.startsWith("task")) {
        overId =
          Object.keys(prev.cards).find((cardId) =>
            prev.cards[cardId].taskIds.includes(overId),
          ) ?? overId;
      }
      // console.log(`ActiveId:${activeId}; OverId:${overId}`);
      const activeCol = findContainerCard(prev, activeId);
      const overCol = findContainerCard(prev, overId);
      // console.log(`ActiveCol:${activeCol}; OverCol:${overCol}`);

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
  function handleTaskDragEnd(activeId: string, overId: string) {
    setState((prev) => {
      const activeCard = findContainerTask(prev, activeId);
      const overCard = findContainerTask(prev, overId);

      if (!activeCard || !overCard || activeCard !== overCard) return prev;

      const tasks = prev.cards[activeCard].taskIds;
      const oldIndex = tasks.indexOf(activeId);
      const newIndex = tasks.indexOf(overId);

      if (oldIndex === newIndex) return prev;

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [activeCard]: {
            ...prev.cards[activeCard],
            taskIds: arrayMove(tasks, oldIndex, newIndex),
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
        collisionDetection={customCollisionDetection(activeItemId ?? null)}
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
          ) : activeItemId.startsWith("card") ? (
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

// Filter out invalid drop targets based on what's being dragged
function customCollisionDetection(activeId: string | null): CollisionDetection {
  return (args) => {
    if (!activeId) return pointerWithin(args);

    // When dragging a card, tasks should NOT be valid collision targets
    if (activeId.startsWith("card-")) {
      const validIds = args.droppableContainers
        .filter((container) => {
          const id = container.id as string;
          // Allow: columns and other cards, but NOT tasks
          return !id.startsWith("task-");
        })
        .map((container) => container.id);

      const filteredContainers = args.droppableContainers.filter((container) =>
        validIds.includes(container.id),
      );

      return pointerWithin({
        ...args,
        droppableContainers: filteredContainers,
      });
    }

    // When dragging a task, cards should NOT be valid collision targets
    if (activeId.startsWith("task-")) {
      const validIds = args.droppableContainers
        .filter((container) => {
          const id = container.id as string;
          // Allow: other tasks and parent cards (as droppable zones), but NOT other cards
          return id.startsWith("task-") || id.startsWith("card-");
        })
        .map((container) => container.id);

      const filteredContainers = args.droppableContainers.filter((container) =>
        validIds.includes(container.id),
      );

      // ----- A small fix for the ui
      let validContainers = args.droppableContainers;
      // Check if pointer is currently inside any card droppable zone
      const pointerCollisions = pointerWithin({
        ...args,
        droppableContainers: validContainers,
      });
      const isInsideCard = pointerCollisions.some((collision) => {
        const id = collision.id as string;
        // Card IDs when used as droppable zones (not as sortable items)
        return id.startsWith("card-");
      });

      if (isInsideCard) {
        return closestCorners({
          ...args,
          droppableContainers: filteredContainers,
        });
      }
      // -----

      return pointerWithin({
        ...args,
        droppableContainers: filteredContainers,
      });
    }

    return pointerWithin(args);
  };
}
