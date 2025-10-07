"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Loading from "../common/Loading";

const GoogleCallbackHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (accessToken && refreshToken) {
        // TODO: fix the google callback case
        // setTokens(accessToken, refreshToken);

        const url = new URL(window.location.href);
        url.searchParams.delete("accessToken");
        url.searchParams.delete("refreshToken");

        // Replace the current URL without the tokens
        window.history.replaceState({}, "", url.toString());

        router.replace("/");
      } else {
        console.error("No tokens received from Google OAuth");
        router.replace("/signin");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <Loading className="mx-auto" />
        </div>
        <p className="text-description">Completing Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleCallbackHandler;
