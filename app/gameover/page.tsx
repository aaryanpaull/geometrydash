"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw, Home } from "lucide-react";

export default function GameOverPage() {
    const router = useRouter();
    const [score, setScore] = useState<string>("0");

    useEffect(() => {
        // Get score from local storage
        const lastScore = localStorage.getItem("neon-pulse-last-score") || "0";
        setScore(lastScore);

        // Listen for 'R' key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "KeyR") {
                router.push("/game");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-slate-950 to-slate-950" />

            <div className="z-10 flex flex-col items-center gap-8 text-center animate-in fade-in zoom-in duration-500">
                <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-[0_0_25px_rgba(255,0,0,0.6)]">
                    CRASHED!
                </h1>

                <div className="space-y-2">
                    <p className="text-slate-400 text-xl tracking-wider uppercase">Final Score</p>
                    <p className="text-6xl font-mono font-bold text-white drop-shadow-[0_0_10px_white]">
                        {score}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 mt-8">
                    <Link href="/game">
                        <button className="px-8 py-4 rounded-full text-xl font-bold flex items-center gap-2 bg-white text-black hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            <RotateCcw className="w-6 h-6" />
                            TRY AGAIN <span className="text-xs opacity-50 ml-1">(R)</span>
                        </button>
                    </Link>

                    <Link href="/">
                        <button className="px-8 py-4 rounded-full text-xl font-bold flex items-center gap-2 border border-slate-700 text-slate-300 hover:bg-slate-800 transition">
                            <Home className="w-6 h-6" />
                            MAIN MENU
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
