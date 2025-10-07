"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthControllerLogout } from "@/api/generated/queries";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/handleError";

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
      <Link href={`/dashboard/user/${"48a7073b-d11b-4bdb-bdde-b3d3d63d0ebb"}`}>
        User Profile
      </Link>
      <Button onClick={() => logout()}>Log out</Button>
    </div>
  );
}
