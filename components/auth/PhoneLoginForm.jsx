"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PhoneLoginForm() {
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginWithOtp } = useAuth();
  const router = useRouter();

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  const formatPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    if (cleaned.startsWith("+91")) return cleaned;
    return `+91${cleaned}`;
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhone(phone);
      const response = await loginWithOtp(formattedPhone, otp);
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
      setOtp("");
      toast.success("New OTP sent!");
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
          <div className="flex">
            <div className="flex items-center justify-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
              +91
            </div>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                setError("");
              }}
              className="h-14 text-lg rounded-l-none rounded-r-xl border-gray-200"
              maxLength={10}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-semibold text-lg rounded-xl"
            disabled={loading}
          >
            {loading ? "Sending..." : "Get OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center text-sm text-gray-500 mb-2">
            Code sent to +91 {phone}
          </div>

          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
              setError("");
            }}
            className="h-14 text-2xl text-center tracking-[0.5em] rounded-xl border-gray-200"
            maxLength={6}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-semibold text-lg rounded-xl"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
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
