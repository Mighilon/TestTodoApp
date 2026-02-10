type ColumnId = "todo" | "inprogress" | "review" | "done";
type CardId = string;
type TaskId = string;

export type ColumnProps = {
  id: ColumnId;
  title: string;
  items: CardProps[];
};

export type CardProps = {
  id: string;
  content: string;
};

export type Column = {
  id: ColumnId;
  title: string;
  cardIds: CardId[];
};

export type Card = {
  id: CardId;
  columnId: ColumnId;
  taskIds: TaskId[];
};

export type Task = {
  id: TaskId;
  content: string;
  completed: boolean;
};
