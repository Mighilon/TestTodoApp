import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import { useBoardContext } from "./BoardContext.tsx";
import ActionBar from "./ActionBar.tsx";
import { Check } from "lucide-react";
import "../index.css";

export default function Board() {
  const {
    state,
    activeItemId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    customCollisionDetection,
    handleAddCard,
  } = useBoardContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  return (
    <div style={{ padding: "20px" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection(activeItemId ?? null)}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col justify-center items-center gap-6 md:flex-2 lg:flex-row">
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
            <div className="p-3 font-semibold bg-white rounded-xl cursor-grab shadow-md/20">
              {state.cards[activeItemId].title}
            </div>
          ) : activeItemId.startsWith("task-") ? (
            <div className=" bg-[#EDF4FC] p-1.5 border border-white rounded-md flex justify-between items-center cursor-grab pr-2 outline-2 outline-slate-300">
              {state.tasks[activeItemId].content}
              <Check
                className={`ml-0.5 text-white text-lg ${state.tasks[activeItemId].completed ? "bg-[#68BB57]" : "bg-slate-300"} cursor-pointer rounded-full p-1 min-w-5`}
                size={20}
                strokeWidth={5}
                absoluteStrokeWidth
              />
            </div>
          ) : (
            <></>
          )}
        </DragOverlay>
      </DndContext>
      <ActionBar onAddCard={handleAddCard} onSave={() => console.log("Save")} />
    </div>
  );
}
