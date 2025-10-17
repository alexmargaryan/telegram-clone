"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthControllerLogout } from "@/api/generated/queries";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/handleError";
import { ROUTES } from "@/lib/routes";

export default function Dashboard() {
  const router = useRouter();
  const { mutate: logout } = useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        router.replace("/signin");
      },
      onError: handleError,
    },
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <Link href={ROUTES.USER_PROFILE("a2a63524-a403-47d9-8268-dae5b60f62f2")}>
        User Profile
      </Link>
      <Button onClick={() => logout()}>Log out</Button>
    </div>
  );
}
