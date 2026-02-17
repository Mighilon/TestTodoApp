import { EllipsisVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type Option = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type DropdownMenuProps = {
  options: Option[];
  className?: string;
};

export default function DropdownMenu({
  options,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedTrigger = triggerRef.current?.contains(e.target as Node);
      const clickedDropdown = buttonRef.current?.contains(e.target as Node);

      if (!clickedTrigger && !clickedDropdown) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const rect = triggerRef.current?.getBoundingClientRect();
  // console.log(ref);

  return (
    <div className={className}>
      <div className="relative inline-block">
        {/* Trigger button */}
        <button
          ref={triggerRef}
          onClick={() => {
            console.log("click");
            setOpen((prev) => !prev);
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <EllipsisVertical className="text-[#9BA0A4]" size={20} />
        </button>
        {/* Dropdown */}
        {open &&
          createPortal(
            <div
              ref={buttonRef}
              style={{ left: rect?.left, top: (rect?.bottom ?? 0) + 10 }}
              className={`absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1`}
            >
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => {
                    console.log("click");
                    option.onClick();
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50
                ${option.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
}
