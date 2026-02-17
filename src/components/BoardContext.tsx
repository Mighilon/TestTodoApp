import { createContext, useContext, type ReactNode } from "react";
import { useState } from "react";
import {
  pointerWithin,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import rawData from "../data/data.json";
import type { CardId, TaskId, BoardState } from "../types";

// BoardContext.tsx
type BoardContextType = {
  state: BoardState;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDeleteCard: (cardId: string) => void;
  handleRenameCard: (cardId: string) => void;
  activeItemId: string | null | undefined;
  customCollisionDetection: (activeId: string | null) => CollisionDetection;
};

const BoardContext = createContext<BoardContextType | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BoardState>(() => rawData as BoardState);

  const [activeItemId, setActiveItemId] = useState<string | null>();

  const findContainerCard = (prev: BoardState, cardId: CardId) => {
    if (Object.keys(prev.columns).includes(cardId)) {
      return cardId;
    }
    return Object.keys(prev.columns).find((columnId) =>
      prev.columns[columnId].cardIds.includes(cardId),
    );
  };

  const findContainerTask = (prev: BoardState, taskId: TaskId) => {
    if (Object.keys(prev.cards).includes(taskId)) {
      return taskId;
    }
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
      const activeCard = findContainerTask(prev, activeId);
      const overCard = findContainerTask(prev, overId);

      if (!activeCard || !overCard || activeCard === overCard) return prev;

      const activeTasks = prev.cards[activeCard].taskIds;
      const overTasks = prev.cards[overCard].taskIds;
      // const activeIndex = activeTasks.indexOf(activeId);
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
      const activeCol = findContainerCard(prev, activeId);
      const overCol = findContainerCard(prev, overId);

      if (!activeCol || !overCol || activeCol === overCol) return prev;

      const activeCards = prev.columns[activeCol].cardIds;
      const overCards = prev.columns[overCol].cardIds;
      // const activeIndex = activeCards.indexOf(activeId);
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

  // Filter out invalid drop targets based on what's being dragged
  function customCollisionDetection(
    activeId: string | null,
  ): CollisionDetection {
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

        const filteredContainers = args.droppableContainers.filter(
          (container) => validIds.includes(container.id),
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

        const filteredContainers = args.droppableContainers.filter(
          (container) => validIds.includes(container.id),
        );

        return pointerWithin({
          ...args,
          droppableContainers: filteredContainers,
        });
      }

      return pointerWithin(args);
    };
  }

  const handleDeleteCard = (cardId: string) => {
    if (!cardId) return;
    setState((prev) => {
      const columnId = findContainerCard(prev, cardId);

      if (!columnId) return prev;

      const newColumns = {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: prev.columns[columnId].cardIds.filter((id) => id !== cardId),
        },
      };

      const newCards = { ...prev.cards };
      delete newCards[cardId];

      return {
        ...prev,
        columns: newColumns,
        cards: newCards,
      };
    });

    setActiveItemId(null);
  };

  const handleRenameCard = (cardId: string) => {
    console.log("Edited!");
  };

  return (
    <BoardContext.Provider
      value={{
        state,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        customCollisionDetection,
        handleDeleteCard,
        handleRenameCard,
        activeItemId,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx)
    throw new Error("useBoardContext must be used inside BoardProvider");
  return ctx;
}
