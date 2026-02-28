import { CloudCheck, LogOut, SquarePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ActionBarProps = {
  onAddCard: () => void;
  onSave: () => void;
};

export default function ActionBar({ onAddCard, onSave }: ActionBarProps) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 bg-white p-3 rounded-md flex gap-3 border-3 border-[#EDF4FC]">
      <button
        onClick={onAddCard}
        className="flex gap-2 items-center px-2.5 h-9 lg:border rounded-md border-gray-300 hover:bg-gray-50"
      >
        <SquarePlus className="text-gray-400" />
        <div className="hidden lg:inline">Add a card</div>
      </button>

      <button
        onClick={onSave}
        className="flex gap-2 items-center px-2.5 h-9 border-0 lg:border rounded-md border-gray-300 hover:bg-gray-50"
      >
        <CloudCheck className="text-gray-400" />
        <div className="hidden lg:inline">Save</div>
      </button>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="flex gap-2 items-center px-2.5 h-9 border-0 lg:border rounded-md border-gray-300 hover:bg-gray-50"
      >
        <LogOut className="text-gray-400" />
        <div className="hidden lg:inline">Log out</div>
      </button>
    </div>
  );
}
