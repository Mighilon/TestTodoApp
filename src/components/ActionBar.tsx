import { CloudCheck, SquarePlus } from "lucide-react";

type ActionBarProps = {
  onAddCard: () => void;
  onSave: () => void;
};

export default function ActionBar({ onAddCard, onSave }: ActionBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 bg-white p-3 rounded-md flex gap-3">
      <button
        onClick={onAddCard}
        className="flex gap-2 items-center px-2.5 h-9 border rounded-md border-gray-300 hover:bg-gray-50"
      >
        <SquarePlus className="text-gray-400" />
        Add a card
      </button>

      <button
        onClick={onSave}
        className="flex gap-2 items-center px-2.5 h-9 border rounded-md border-gray-300 hover:bg-gray-50"
      >
        <CloudCheck className="text-gray-400" />
        Save
      </button>
    </div>
  );
}
