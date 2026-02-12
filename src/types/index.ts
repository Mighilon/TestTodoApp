export type ColumnId = string;
export type CardId = string;
export type TaskId = string;

export type ColumnProps = {
  id: ColumnId;
  title: string;
  cardIds: CardId[];
  cards: Record<CardId, Card>;
  tasks: Record<TaskId, Task>;
};

export type CardProps = {
  id: string;
  title: string;
  taskIds: TaskId[];
  tasks: Record<TaskId, Task>;
};

export type TaskProps = {
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
  title: string;
  taskIds: TaskId[];
};

export type Task = {
  id: TaskId;
  content: string;
  completed: boolean;
};

export type BoardState = {
  tasks: Record<string, Task>;
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: ColumnId[];
};
