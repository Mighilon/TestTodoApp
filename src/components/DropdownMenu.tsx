import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type DropdownMenuProps = {
  options: Option[];
};

export default function DropdownMenu({ options }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="Open menu"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                option.onClick();
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50
                ${option.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
