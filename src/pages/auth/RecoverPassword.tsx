import { useState, useEffect } from "react";
import {
  AuthCard,
  InputField,
  PrimaryButton,
} from "./../../components/AuthCard.tsx";
import { useNavigate } from "react-router-dom";

export default function RecoverPassword() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (sent) {
    return (
      <AuthCard title="Check your inbox.">
        <div
          className="text-center py-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 100ms",
          }}
        >
          <div className="text-5xl mb-4">📬</div>
          <p className="text-sm text-[#4a7a8a] leading-relaxed">
            If an account is linked to{" "}
            <span className="font-semibold text-[#0d4f6b]">{email}</span>,
            you'll receive a reset link shortly.
          </p>
          <button
            className="mt-6 text-xs text-[#3aa5cc] hover:underline"
            onClick={() => {
              navigate("/login");
            }}
          >
            ← Back to Login
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Recover password."
      subtitle="Enter your email and we'll send you a reset link."
    >
      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        delay={100}
        visible={visible}
      />

      <div className="mt-1 mb-6" />

      <PrimaryButton
        label="Send Reset Link"
        onClick={() => setSent(true)}
        delay={200}
        visible={visible}
      />

      <div
        className="mt-5 text-center text-xs text-[#4a7a8a]"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 300ms",
        }}
      >
        <button
          className="text-[#3aa5cc] hover:underline"
          onClick={() => {
            navigate("/login");
          }}
        >
          ← Back to Login
        </button>
      </div>
    </AuthCard>
  );
}
