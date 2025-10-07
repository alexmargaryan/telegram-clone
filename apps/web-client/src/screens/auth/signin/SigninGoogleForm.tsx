"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

const SigninGoogleForm = () => {
  return (
    <Button
      className="h-12 w-full border border-gray-300 text-gray-700 hover:bg-gray-50"
      variant="ghost"
      onClick={() => {
        window.location.href = "http://localhost:5000/api/auth/google/login";
      }}
    >
      <Image
        src={"/images/google-logo.png"}
        alt="Google Logo"
        width={20}
        height={20}
        priority
      />
      <span>Continue with Google</span>
    </Button>
  );
};

export default SigninGoogleForm;
