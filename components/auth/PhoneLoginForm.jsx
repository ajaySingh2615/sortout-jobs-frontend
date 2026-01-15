"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PhoneLoginForm() {
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginWithOtp } = useAuth();
  const router = useRouter();
  const otpRefs = useRef([]);

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  const formatPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    if (cleaned.startsWith("+91")) return cleaned;
    return `+91${cleaned}`;
  };

  // Format phone display with dashes
  const formatPhoneDisplay = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";

    // Format: XX XX XX XX XX
    const parts = [];
    for (let i = 0; i < digits.length; i += 2) {
      parts.push(digits.slice(i, i + 2));
    }
    return parts.join(" ");
  };

  // Get placeholder with dashes for remaining digits
  const getPhonePlaceholder = () => {
    const filledLength = phone.replace(/\D/g, "").length;
    const remaining = 10 - filledLength;

    if (remaining <= 0) return "";

    // Create placeholder parts
    const placeholderDigits = "_ ".repeat(remaining).trim();
    return placeholderDigits;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setPhone(value);
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhone(phone);
      await authService.sendOtp(formattedPhone);
      setStep(2);
      toast.success("OTP sent to your phone!");
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMsg);

      if (err.response?.status === 429) {
        setError("Too many OTP requests. Please wait before trying again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    // Focus last filled or next empty
    const focusIndex = Math.min(pastedData.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhone(phone);
      const response = await loginWithOtp(formattedPhone, otpString);
      const isNewUser = response.data?.isNewUser;

      toast.success("Login successful! Welcome to SortOut Jobs");

      if (isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const errorCode = err.response?.data?.errorCode;
      const errorMsg = err.response?.data?.message;

      if (errorCode === "OTP_001") {
        setError("OTP has expired. Please request a new one.");
      } else if (errorCode === "OTP_002") {
        setError("Invalid OTP. Please check and try again.");
      } else {
        setError(errorMsg || "Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const formattedPhone = formatPhone(phone);
      await authService.sendOtp(formattedPhone);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent!");
      otpRefs.current[0]?.focus();
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Please wait before requesting another OTP.");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {/* Phone Input with Dashes */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <div className="flex items-center justify-center px-4 py-4 bg-gray-100 text-gray-600 font-medium border-r border-gray-200">
              +91
            </div>
            <div className="relative flex-1">
              <input
                type="tel"
                value={formatPhoneDisplay(phone)}
                onChange={handlePhoneChange}
                className="w-full h-14 px-4 text-xl font-mono tracking-wider bg-transparent outline-none placeholder:text-gray-300"
                placeholder="__ __ __ __ __"
                maxLength={14}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-semibold text-lg rounded-xl"
            disabled={loading || phone.length < 10}
          >
            {loading ? "Sending..." : "Get OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center text-sm text-gray-500 mb-4">
            Enter the code sent to{" "}
            <span className="font-medium text-gray-700">
              +91 {formatPhoneDisplay(phone)}
            </span>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                maxLength={1}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-semibold text-lg rounded-xl"
            disabled={loading || otp.join("").length !== 6}
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Change Number
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
