import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
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
import type { CardId, TaskId, BoardState, Task, Card } from "../types";
import { throttle } from "lodash";
import { DRAG_UPDATE_DELAY } from "../constants";

// BoardContext.tsx
type BoardContextType = {
  state: BoardState;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDeleteCard: (cardId: string) => void;
  handleAddCard: () => void;
  handleRenameCard: (cardId: string, newTitle: string) => void;
  activeItemId: string | null | undefined;
  setActiveItemId: Dispatch<SetStateAction<string | null | undefined>>;
  customCollisionDetection: (activeId: string | null) => CollisionDetection;
  handleTaskChangeState: (taskId: string) => void;
  handleAddTask: (cardId: string) => void;
  handleTaskChangeContent: (taskId: string, newContent: string) => void;
  handleDeleteTask: (taskId: string) => void;
};

const BoardContext = createContext<BoardContextType | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BoardState>(() => rawData as BoardState);

  const [activeItemId, setActiveItemId] = useState<string | null>();
  const isScrolling = useRef(false);

  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>(200);
  useEffect(() => {
    const handleScroll = () => {
      isScrolling.current = true;
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150); // adjust — time after scroll stops before snapping resumes
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleDragOver = throttle((event: DragOverEvent) => {
    if (isScrolling.current) return;
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
  }, DRAG_UPDATE_DELAY);

  function handleDragOverTask(activeId: string, overId: string) {
    console.log("HandleDragOverTask");
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
    console.log("HandleDragOverCard");
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

        // return closestCorners({
        return pointerWithin({
          ...args,
          droppableContainers: filteredContainers,
        });
      }

      return pointerWithin(args);
    };
  }

  const handleTaskChangeState = (taskId: string) => {
    setState((prev) => {
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...prev.tasks[taskId],
            completed: !prev.tasks[taskId].completed,
          },
        },
      };
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setState((prev) => {
      const cardId = findContainerTask(prev, taskId);

      if (!cardId) return prev;

      const newCards = {
        ...prev.cards,
        [cardId]: {
          ...prev.cards[cardId],
          taskIds: prev.cards[cardId].taskIds.filter((id) => id !== taskId),
        },
      };

      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      setActiveItemId(null);

      return {
        ...prev,
        cards: newCards,
        tasks: newTasks,
      };
    });
  };

  const handleAddTask = (cardId: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      content: "New task",
      completed: false,
    };

    setState((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [newTaskId]: newTask,
      },
      cards: {
        ...prev.cards,
        [cardId]: {
          ...prev.cards[cardId],
          taskIds: [...prev.cards[cardId].taskIds, newTaskId],
        },
      },
    }));
  };

  const handleAddCard = () => {
    const newCardId = `card-${Date.now()}`;
    const newCard: Card = {
      id: newCardId,
      title: "New Card",
      taskIds: [],
    };
    setState((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [newCardId]: newCard,
      },
      columns: {
        ...prev.columns,
        ["col-1"]: {
          ...prev.columns["col-1"],
          cardIds: [newCardId, ...prev.columns["col-1"].cardIds],
        },
      },
    }));
  };

  const handleTaskChangeContent = (taskId: string, newContent: string) => {
    setState((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...prev.tasks[taskId],
          content: newContent,
        },
      },
    }));
  };

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

      const newTasks = { ...prev.tasks };
      prev.cards[cardId].taskIds.forEach((taskId) => {
        delete newTasks[taskId];
      });

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
  const handleRenameCard = (cardId: string, newTitle: string) => {
    setState((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: {
          ...prev.cards[cardId],
          title: newTitle,
        },
      },
    }));
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
        handleAddCard,
        handleRenameCard,
        activeItemId,
        setActiveItemId,
        handleTaskChangeState,
        handleAddTask,
        handleTaskChangeContent,
        handleDeleteTask,
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
