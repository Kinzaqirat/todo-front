// app/page.tsx
import React from "react";
import TodoApp from "@/components/ui";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <TodoApp/>
    </main>
  );
}
