"use client";

import { useUsersControllerMe } from "@/api/generated/queries";

export default function useUser() {
  const { data: user, ...rest } = useUsersControllerMe();

  return {
    user,
    ...rest,
  };
}
