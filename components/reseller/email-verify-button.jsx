"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";
import { useUser } from "@/app/contexts/UserContext";
import { fetchWithAuth } from "@/lib/utility/fetchWithAuth";
import toast from "react-hot-toast";

export  function VerifyEmailButton() {
  const router = useRouter();
  const { Reseller, isLoadingReseller } = useUser();

  if (isLoadingReseller) return null;

  const isVerified = Reseller?.isAccountVerified;

  const handleVerifyClick = async () => {
    console.log("Verified", isVerified);
    if (isVerified) return;

    try {
      const res = await fetchWithAuth(`/auth/send-verify-otp`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return toast.error(data.message || "Failed to send OTP");
      }

      toast.success("OTP sent! Check your email.");
      router.push("/auth/Verifyandreset/VerifyEmail");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Button
      disabled={isVerified}
      onClick={handleVerifyClick}
      className={`flex items-center gap-2 ${
        isVerified
          ? "bg-green-100 text-green-700 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isVerified ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Verified
        </>
      ) : (
        <>
          <Mail className="w-4 h-4" />
          Verify Email
        </>
      )}
    </Button>
  );
}
