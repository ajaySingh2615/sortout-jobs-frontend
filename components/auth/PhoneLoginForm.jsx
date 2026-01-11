"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

  // Validate phone number
  const validatePhone = (phoneNumber) => {
    // Indian phone: +91XXXXXXXXXX or 10 digits
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""));
  };

  // Format phone for API
  const formatPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    if (cleaned.startsWith("+91")) return cleaned;
    return `+91${cleaned}`;
  };

  // Handle Send OTP
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

      // Handle rate limiting
      if (err.response?.status === 429) {
        setError("Too many OTP requests. Please wait before trying again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
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
      await loginWithOtp(formattedPhone, otp);
      toast.success("Login successful! Welcome to SortOut Jobs");
      router.push("/dashboard");
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

  // Resend OTP
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
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {step === 1 ? "Login with Phone" : "Enter OTP"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {step === 1
            ? "Enter your phone number to receive OTP"
            : `We sent a code to +91${phone.slice(-10)}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <div className="flex">
                <div className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-600 text-sm">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                    );
                    setError("");
                  }}
                  className="rounded-l-none border-gray-300 focus:ring-red-500 focus:border-red-500"
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
                  setError("");
                }}
                className="text-center text-2xl tracking-widest border-gray-300 focus:ring-red-500 focus:border-red-500"
                maxLength={6}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5"
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
                className="text-gray-600 hover:text-gray-900"
              >
                ← Change Number
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
