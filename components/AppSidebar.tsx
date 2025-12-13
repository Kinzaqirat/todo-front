"use client";

import { signOutAction } from "@/app/actions/auth";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function AppSidebar() {
    const { data: session } = useSession();

    return (
        <div className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TaskMaster</h1>
            </div>

            <div className="flex-1">
                <div className="space-y-4">
                    {/* Placeholder for future links */}
                    <div className="p-2 text-gray-600 dark:text-gray-400 font-medium">
                        Menu
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <User size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {session?.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>

                <form action={signOutAction}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </form>
            </div>
        </div>
    );
}
