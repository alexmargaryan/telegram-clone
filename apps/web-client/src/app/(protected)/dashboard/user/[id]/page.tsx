"use client";

import { useParams } from "next/navigation";

import { useUsersControllerFindOne } from "@/api/generated/queries";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading } = useUsersControllerFindOne(id, {
    query: {
      enabled: !!id,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>{user.email}</p>
      <p>{user.role}</p>
      <p>{user.createdAt}</p>
      <p>{user.updatedAt}</p>
    </div>
  );
}
