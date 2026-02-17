import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import { useBoardContext } from "./BoardContext.tsx";

export default function Board() {
  const {
    state,
    activeItemId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    customCollisionDetection,
  } = useBoardContext();
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div style={{ padding: "20px" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection(activeItemId ?? null)}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col justify-center gap-6 md:flex-2 lg:flex-row">
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
