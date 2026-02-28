import { useState, useEffect } from "react";
import {
  AuthCard,
  InputField,
  PrimaryButton,
} from "./../../components/AuthCard.tsx";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const passwordMismatch =
    passwordCheck.length > 0 && password !== passwordCheck;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AuthCard
      title="Create account."
      subtitle="Start organising your life today."
    >
      <InputField
        label="Username"
        placeholder="your_username"
        value={username}
        onChange={setUsername}
        delay={100}
        visible={visible}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={setPassword}
        delay={200}
        visible={visible}
      />

      {/* Password check with mismatch indicator */}
      <div
        className="mb-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
        }}
      >
        <label className="block text-xs font-semibold tracking-wider uppercase text-[#3a7a90] mb-1.5">
          Confirm Password
        </label>
        <input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          placeholder="••••••••"
          className={`w-full px-4 py-3 rounded-xl bg-[#f0f8ff]/80 border text-[#0d4f6b] placeholder-[#9acad8] text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
            passwordMismatch
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-[#b3dff0] focus:border-[#3aa5cc] focus:ring-[#3aa5cc]/20"
          }`}
        />
        {passwordMismatch && (
          <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
        )}
      </div>

      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        optional
        delay={400}
        visible={visible}
      />

      <p
        className="-mt-2 mb-5 text-xs text-[#7ab0c0]"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 420ms",
        }}
      >
        Used only for password recovery if you ever get locked out.
      </p>

      <PrimaryButton
        label="Create Account"
        delay={500}
        visible={visible}
        onClick={() => {
          navigate("/login");
        }}
      />

      <div
        className="mt-5 text-center text-xs text-[#4a7a8a]"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 580ms",
        }}
      >
        Already have an account?{" "}
        <button
          className="text-[#3aa5cc] font-semibold hover:underline"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    </AuthCard>
  );
}
