// // // "use client";

// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { signInAction } from "../app/actions/auth";
// // // import { useState } from "react";
// // // import Link from "next/link";
// // // import { useRouter } from "next/navigation";

// // // export default function SignInPageForm() {
// // //     const router = useRouter();
// // //     const [error, setError] = useState<string>("");
// // //     const [loading, setLoading] = useState(false);

// // //     async function handleSubmit(formData: FormData) {
// // //         setError("");
// // //         setLoading(true);

// // //         try {
// // //             const result = await signInAction(formData);

// // //             // Your action returns: { error: string } or { success: true }
// // //             if (result?.error) {
// // //                 setError(result.error);
// // //                 return;
// // //             }

// // //             if (result?.success) {
// // //                 router.push("/todo");
// // //             }
// // //         } catch (err: any) {
// // //             setError("An unexpected error occurred");
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     }

// // //     return (
// // //         <div className="flex flex-col items-center justify-center h-screen gap-4">
// // //             <h1 className="text-2xl font-black">Sign In</h1>

// // //             <form action={handleSubmit} className="flex flex-col gap-3 w-64">
// // //                 <Input
// // //                     type="email"
// // //                     name="email"
// // //                     placeholder="Email"
// // //                     required
// // //                     autoComplete="email"
// // //                 />
// // //                 <Input
// // //                     type="password"
// // //                     name="password"
// // //                     placeholder="Password"
// // //                     required
// // //                     autoComplete="current-password"
// // //                 />

// // //                 {error && (
// // //                     <p className="text-red-500 text-sm">{error}</p>
// // //                 )}

// // //                 <Button type="submit" disabled={loading}>
// // //                     {loading ? "Signing in..." : "Sign In"}
// // //                 </Button>
// // //             </form>

// // //             <p className="text-sm text-gray-600">
// // //                 Don't have an account?{" "}
// // //                 <Link href="/signup" className="text-blue-600 hover:underline">
// // //                     Sign up
// // //                 </Link>
// // //             </p>
// // //         </div>
// // //     );
// // // }

// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import GoogleSignInButton from "@/components/GoogleSignInButton";

// // export default function SignInPage() {
// //   const router = useRouter();
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   async function handleSubmit(formData: FormData) {
// //     setError("");
// //     setLoading(true);
// //     try {
// //       const res = await fetch("/api/auth/local-signin", {
// //         method: "POST",
// //         body: formData,
// //       });
// //       const data = await res.json();
// //       if (!res.ok) {
// //         setError(data?.error || "Sign in failed");
// //         return;
// //       }
// //       router.push("/todo");
// //     } catch (err: any) {
// //       setError("An unexpected error occurred");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   return (
// //     <div className="flex flex-col items-center justify-center h-screen gap-4">
// //       <h1 className="text-2xl font-black">Sign In</h1>

// //       <div className="flex flex-col gap-3 w-64">
// //         <form action={handleSubmit} className="flex flex-col gap-3">
// //           <Input type="email" name="email" placeholder="Email" required />
// //           <Input type="password" name="password" placeholder="Password" required />
// //           {error && <p className="text-red-500 text-sm">{error}</p>}
// //           <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
// //         </form>

// //         <div className="flex items-center gap-3 my-2">
// //           <hr className="flex-1" />
// //           <span className="text-sm text-gray-400">or</span>
// //           <hr className="flex-1" />
// //         </div>

// //         <GoogleSignInButton callbackUrl="/todo" />
// //       </div>

// //       <p className="text-sm text-gray-600">
// //         Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
// //       </p>
// //     </div>
// //   );
// // }


// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { signInAction } from "../app/actions/auth";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { signIn } from "@/lib/auth-client";

// export default function SignInPageForm() {
//     const router = useRouter();
//     const [error, setError] = useState<string>("");
//     const [loading, setLoading] = useState(false);
//     const [googleLoading, setGoogleLoading] = useState(false);

//     async function handleSubmit(formData: FormData) {
//         setError("");
//         setLoading(true);

//         try {
//             const result = await signInAction(formData);

//             if (result?.error) {
//                 setError(result.error);
//                 return;
//             }

//             if (result?.success) {
//                 router.push("/todo");
//             }
//         } catch (err: any) {
//             setError("An unexpected error occurred");
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function handleGoogleSignIn() {
//         setError("");
//         setGoogleLoading(true);
//         try {
//             await signIn.social({
//                 provider: "google",
//                 callbackURL: "/todo",
//             });
//         } catch (err: any) {
//             setError("Failed to sign in with Google");
//             setGoogleLoading(false);
//         }
//     }

//     return (
//         <div className="flex flex-col items-center justify-center h-screen gap-4">
//             <h1 className="text-2xl font-black">Sign In</h1>

//             <form action={handleSubmit} className="flex flex-col gap-3 w-64">
//                 <Input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     required
//                     autoComplete="email"
//                 />
//                 <Input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     required
//                     autoComplete="current-password"
//                 />

//                 {error && (
//                     <p className="text-red-500 text-sm">{error}</p>
//                 )}

//                 <Button type="submit" disabled={loading}>
//                     {loading ? "Signing in..." : "Sign In"}
//                 </Button>
//             </form>

//             <div className="flex items-center gap-2 w-64">
//                 <div className="flex-1 h-px bg-gray-300"></div>
//                 <span className="text-sm text-gray-500">OR</span>
//                 <div className="flex-1 h-px bg-gray-300"></div>
//             </div>

//             <Button 
//                 onClick={handleGoogleSignIn}
//                 disabled={googleLoading}
//                 variant="outline"
//                 className="w-64 flex items-center justify-center gap-2"
//             >
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 {googleLoading ? "Signing in..." : "Continue with Google"}
//             </Button>

//             <p className="text-sm text-gray-600">
//                 Don't have an account?{" "}
//                 <Link href="/signup" className="text-blue-600 hover:underline">
//                     Sign up
//                 </Link>
//             </p>
//         </div>
//     );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction } from "../app/actions/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPageForm() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError("");
        setLoading(true);

        try {
            const result = await signInAction(formData);

            if (result?.error) {
                setError(result.error);
                return;
            }

            if (result?.success) {
                router.push("/todo");
            }
        } catch (err: any) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        setError("");
        setGoogleLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/todo",
            });
        } catch (err: any) {
            setError("Failed to sign in with Google");
            setGoogleLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-black">Sign In</h1>

            <form action={handleSubmit} className="flex flex-col gap-3 w-64">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoComplete="email"
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>

            <div className="flex items-center gap-2 w-64">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <Button 
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                variant="outline"
                className="w-64 flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}