import { useState, useEffect, type ReactNode } from "react";
import bg from "./../assets/watercolour-abstract-blue-ocean-white-clouds.jpg";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(28px) scale(0.97)",
          transition: "opacity 0.65s ease, transform 0.65s ease",
        }}
      >
        {/* App wordmark */}
        <div className="text-center mb-6">
          <span className="text-sm font-semibold tracking-[0.25em] uppercase text-[#3aa5cc]">
            ✦ TodoApp ✦
          </span>
        </div>

        {/* Glass card */}
        <div className="bg-white/75 backdrop-blur-md rounded-3xl shadow-2xl px-8 py-10 border border-white/60">
          <h1
            className="text-3xl font-bold text-[#0d4f6b] mb-1"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#4a7a8a] mb-7">{subtitle}</p>
          )}
          <div className={subtitle ? "" : "mt-6"}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable field components ──────────────────────────────────────────────

type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  optional?: boolean;
  delay?: number;
  visible?: boolean;
};

export function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  optional,
  delay = 0,
  visible = true,
}: InputFieldProps) {
  return (
    <div
      className="mb-5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <label className="block text-xs font-semibold tracking-wider uppercase text-[#3a7a90] mb-1.5">
        {label}
        {optional && (
          <span className="ml-1.5 normal-case font-normal text-[#7ab0c0]">
            (optional)
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#f0f8ff]/80 border border-[#b3dff0] text-[#0d4f6b] placeholder-[#9acad8] text-sm focus:outline-none focus:border-[#3aa5cc] focus:ring-2 focus:ring-[#3aa5cc]/20 transition-all duration-200"
      />
    </div>
  );
}

type PrimaryButtonProps = {
  label: string;
  onClick?: () => void;
  delay?: number;
  visible?: boolean;
};

export function PrimaryButton({
  label,
  onClick,
  delay = 0,
  visible = true,
}: PrimaryButtonProps) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <button
        onClick={onClick}
        className="w-full py-3.5 text-sm font-semibold text-white rounded-xl bg-[#3aa5cc] hover:bg-[#2a8fb5] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
      >
        {label}
      </button>
    </div>
  );
}
