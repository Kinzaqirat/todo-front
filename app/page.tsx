
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/todo"); // 🔥 User goes directly to todo page
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white px-6">
      <h1 className="text-5xl font-extrabold tracking-tight text-center">TODO APP</h1>

      <p className="mt-4 text-gray-300 text-center max-w-md">
        A modern TODO APP
      </p>

      <div className="flex gap-4 mt-10">
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/signup">Create Account</Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-gray-400 text-gray-200 hover:bg-gray-700"
        >
          <Link href="/signin">Log In</Link>
        </Button>
      </div>
    </div>
  );
}
