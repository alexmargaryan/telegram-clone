"use client";

import { useRouter } from "next/navigation";

import GoogleCallbackHandler from "@/components/auth/GoogleCallbackHandler";
import Loading from "@/components/common/Loading";
import useUser from "@/hooks/useUser";

export default function AuthCallback() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (user) {
    return router.replace("/");
  }

  return <GoogleCallbackHandler />;
}
