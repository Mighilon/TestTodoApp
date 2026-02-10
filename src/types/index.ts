export type Column = {
  id: "todo" | "inprogress" | "review" | "done";
  title: string;
};

export type ColumnProps = {
  id: string;
  title: string;
  items: CardProps[];
};

export type CardProps = {
  id: string;
  content: string;
};

export type Card = {
  id: string;
  columnId: Column["id"];
  taskIds: string[];
};

export type Task = {
  id: string;
  cardId: string;
  content: string;
  completed: boolean;
};
