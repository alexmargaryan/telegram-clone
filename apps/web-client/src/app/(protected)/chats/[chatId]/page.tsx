"use client";

import { useParams } from "next/navigation";

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <div>
      <h1>Chat {chatId}</h1>
    </div>
  );
}
