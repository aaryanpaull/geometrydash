"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Crown, Medal } from "lucide-react";

interface ScoreEntry {
    name: string;
    score: number;
    date: string;
}

export default function LeaderboardPage() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("neon-pulse-leaderboard");
        if (stored) {
            setScores(JSON.parse(stored));
        } else {
            // Seed dummy data if empty
            const dummy: ScoreEntry[] = [
                { name: "NEO", score: 15000, date: new Date().toISOString() },
                { name: "TRON", score: 12500, date: new Date().toISOString() },
                { name: "CYPHER", score: 9000, date: new Date().toISOString() },
                { name: "GHOST", score: 5000, date: new Date().toISOString() },
                { name: "VIX", score: 2500, date: new Date().toISOString() },
            ];
            localStorage.setItem("neon-pulse-leaderboard", JSON.stringify(dummy));
            setScores(dummy);
        }
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />;
        if (index === 1) return <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
        return <span className="w-6 text-center font-mono opacity-50">#{index + 1}</span>;
    };

    const getRowStyle = (index: number) => {
        if (index === 0) return "bg-yellow-400/10 border-yellow-400/20";
        if (index === 1) return "bg-slate-300/10 border-slate-300/20";
        if (index === 2) return "bg-amber-600/10 border-amber-600/20";
        return "bg-slate-900/40 border-slate-800 hover:bg-slate-800/40";
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="z-10 w-full max-w-2xl flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-white transition">
                        <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span>Back</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan drop-shadow-[0_0_10px_rgba(255,0,255,0.4)]">
                        HALL OF FAME
                    </h1>
                    <div className="w-24" /> {/* Spacer for centering */}
                </header>

                <div className="flex flex-col gap-3">
                    {scores.map((entry, i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${getRowStyle(i)}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8">
                                    {getRankIcon(i)}
                                </div>
                                <span className="font-bold text-lg tracking-wider">{entry.name}</span>
                            </div>
                            <span className="font-mono text-xl font-bold text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                                {entry.score.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
