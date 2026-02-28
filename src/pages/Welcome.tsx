import { useState, useEffect } from "react";
import bg from "./../assets/watercolour-abstract-blue-ocean-white-clouds.jpg";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delayMs: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.75s ease ${delayMs}ms, transform 0.75s ease ${delayMs}ms`,
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Soft overlay so text stays readable */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" />

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-end gap-3 px-8 py-5"
        style={fadeIn(0)}
      >
        <button
          className="px-5 py-2 text-sm font-medium text-[#1a6a8a] rounded-full border border-[#7ec8e3] bg-white/70 hover:bg-[#e0f4fc] hover:border-[#3aa5cc] hover:shadow-md active:scale-95 transition-all duration-200 backdrop-blur-sm"
          // onClick={()=>{navigate("/about")}}
        >
          About
        </button>
        <button
          className="px-5 py-2 text-sm font-medium text-white rounded-full bg-[#3aa5cc] hover:bg-[#2a8fb5] hover:shadow-lg active:scale-95 transition-all duration-200 shadow-md"
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </button>
      </nav>

      {/* Hero — vertically centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* App name */}
        <div style={fadeIn(150)} className="mb-4">
          <span className="text-sm font-semibold tracking-[0.25em] uppercase text-[#3aa5cc]">
            ✦ TodoApp ✦
          </span>
        </div>

        {/* Headline */}
        <h1
          className="max-w-2xl text-5xl sm:text-6xl font-bold leading-tight text-[#0d4f6b] mb-5 drop-shadow-sm"
          style={{
            fontFamily: "'Georgia', serif",
            ...fadeIn(300),
          }}
        >
          Stop forgetting.
          <br />
          <span className="text-[#3aa5cc]">Start achieving.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="max-w-sm text-base text-[#2a6070] mb-10 leading-relaxed"
          style={fadeIn(450)}
        >
          The simplest, most satisfying todo app proven to help you conquer
          everything that matters.
        </p>

        {/* Login CTA */}
        <div style={fadeIn(600)}>
          <button
            className="px-10 py-3.5 text-base font-semibold text-white rounded-full bg-[#3aa5cc] hover:bg-[#2a8fb5] hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 shadow-lg"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
}
