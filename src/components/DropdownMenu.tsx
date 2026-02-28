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
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  const handleOpen = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const MENU_WIDTH = 160;
    const MENU_HEIGHT = options.length * 40;
    const MARGIN = 10;

    let left = rect.left;
    if (left + MENU_WIDTH > window.innerWidth - MARGIN) {
      left = rect.right - MENU_WIDTH;
    }

    let top = rect.bottom + MARGIN;
    if (top + MENU_HEIGHT > window.innerHeight - MARGIN) {
      top = rect.top - MENU_HEIGHT - MARGIN;
    }

    setMenuStyle({ top, left });
    setOpen((prev) => !prev);
  };

  return (
    <div className={className}>
      <div className="relative inline-block">
        <button
          ref={triggerRef}
          onClick={handleOpen}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <EllipsisVertical className="text-[#9BA0A4]" size={20} />
        </button>

        {open &&
          createPortal(
            <div
              ref={buttonRef}
              style={{ ...menuStyle, position: "fixed", width: 160 }}
              className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
            >
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => {
                    option.onClick();
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50
                    ${option.danger ? "font-medium text-red-600 hover:bg-red-50" : "text-gray-700"}`}
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
