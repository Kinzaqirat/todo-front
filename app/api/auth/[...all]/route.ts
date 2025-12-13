// import { auth } from "@/lib/auth";
// import { toNextJsHandler } from "better-auth/next-js";

// export const { GET, POST } = toNextJsHandler(auth);

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;
export const POST = handler.POST;

// Add this for better Vercel compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';