import { useState } from "react";
import type { CardProps } from "../types";
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

export default function Board() {
  const [columns, setColumns] = useState<Record<string, CardProps[]>>({
    todo: [
      { id: "task-1", content: "Design mockups" },
      { id: "task-2", content: "Write documentation" },
    ],
    inprogress: [{ id: "task-3", content: "Build feature" }],
    done: [
      { id: "task-4", content: "Setup project" },
      { id: "task-5", content: "Install dependencies" },
    ],
    review: [
      { id: "task-6", content: "Waiting for review" },
      { id: "task-7", content: "Review in progress" },
    ],
  });

  const [activeId, setActiveId] = useState<string>();

  const sensors = useSensors(useSensor(PointerSensor));

  // Helper to find which column contains a task
  const findContainer = (id: string) => {
    // Check if id is a column
    if (id in columns) {
      return id;
    }
    // Find column containing the task
    return Object.keys(columns).find((key) =>
      columns[key].some((task) => task.id === id),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log(`==============V===========`);
    console.log(columns);
    const { active, over } = event;
    console.log(`Active: ${active}; Over: ${over}`);
    if (!over) return;

    const activeContainer = findContainer(active.id.toString());
    const overContainer = findContainer(over.id.toString());

    console.log(
      `ActiveContainer: ${activeContainer}; OverContainer: ${overContainer}`,
    );
    console.log();
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    const activeItems = columns[activeContainer];
    const overItems = columns[overContainer];

    console.log(
      `ActiveItems: ${JSON.stringify(activeItems)}; OverItems: ${JSON.stringify(overItems)}`,
    );
    console.log(`Active.id: ${active.id}; Over.id: ${over.id}`);

    const activeIndex = activeItems.findIndex((t) => t.id === active.id);
    const overIndex = overItems.findIndex((t) => t.id === over.id);
    console.log(`ActiveIndex: ${activeIndex}; OverIndex: ${overIndex}`);

    let newIndex = -1;
    if (over.id === overContainer) {
      // Dropping in empty column
      newIndex = overItems.length;
    } else {
      // Dropping on item
      newIndex = overIndex;
    }
    if (activeIndex === -1 || newIndex === -1) return;

    if (activeItems[activeIndex]?.id === overItems[newIndex]?.id) return;

    setColumns({
      ...columns,
      [activeContainer]: activeItems.filter((t) => t.id !== active.id),
      [overContainer]: [
        ...overItems.slice(0, newIndex),
        activeItems[activeIndex],
        ...overItems.slice(newIndex),
      ],
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId("");

    if (!over) return;

    const activeContainer = findContainer(active.id.toString());
    const overContainer = findContainer(over.id.toString());

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Reordering within same column
      setColumns((prev) => {
        const items = prev[activeContainer];
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);

        return {
          ...prev,
          [activeContainer]: arrayMove(items, oldIndex, newIndex),
        };
      });
    }
  };

  const activeTask = activeId
    ? Object.values(columns)
        .flat()
        .find((task) => task.id === activeId)
    : null;

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
          <Column id="todo" title="To Do" items={columns.todo} />
          <Column
            id="inprogress"
            title="In Progress"
            items={columns.inprogress}
          />
          <Column id="done" title="Done" items={columns.done} />
          <Column id="review" title="Review" items={columns.review} />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="p-3 bg-white rounded-xl cursor-grab shadow-md/20">
              {activeTask.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
