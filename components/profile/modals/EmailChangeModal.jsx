"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mail, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

export default function EmailChangeModal({
  isOpen,
  onClose,
  onSendOtp,
  onVerifyOtp,
}) {
  const [step, setStep] = useState(1); // 1: Input Email, 2: Verify OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // seconds remaining
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail("");
      setOtp("");
      setTimeLeft(0);
      setCanResend(false);
      setError("");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    try {
      const response = await onSendOtp(email);
      // Get expiry time from response
      const expiresInSeconds = response?.data?.data?.expiresInSeconds || 300;
      setTimeLeft(expiresInSeconds);
      setCanResend(false);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    setLoading(true);
    setError("");
    try {
      const response = await onSendOtp(email);
      const expiresInSeconds = response?.data?.data?.expiresInSeconds || 300;
      setTimeLeft(expiresInSeconds);
      setCanResend(false);
      setOtp(""); // Clear previous OTP
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError("");
    try {
      await onVerifyOtp(otp);
      onClose(); // Close on success
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Change Email</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your new email address. We&apos;ll send a verification code
              to confirm ownership.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send Verification Code"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="text-sm text-gray-500 mt-1">
                We sent a verification code to{" "}
                <span className="font-medium text-gray-800">{email}</span>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                {timeLeft > 0 && (
                  <span className="text-xs text-gray-500">
                    Expires in:{" "}
                    <span className="font-mono font-semibold text-red-600">
                      {formatTime(timeLeft)}
                    </span>
                  </span>
                )}
                {timeLeft === 0 && step === 2 && (
                  <span className="text-xs text-red-600 font-medium">
                    OTP Expired
                  </span>
                )}
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                  setError(""); // Clear error on input
                }}
                placeholder="000000"
                className="w-full px-4 py-2.5 text-center text-2xl tracking-widest border rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono"
                maxLength={6}
                required
                disabled={timeLeft === 0}
              />
            </div>

            <button
              type="submit"
              disabled={loading || timeLeft === 0}
              className="w-full py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Verifying..."
                : timeLeft === 0
                ? "OTP Expired"
                : "Verify & Update Email"}
              {!loading && timeLeft > 0 && <CheckCircle2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
                className="flex-1 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Sending..." : "Resend OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setTimeLeft(0);
                  setCanResend(false);
                }}
                className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Change email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
