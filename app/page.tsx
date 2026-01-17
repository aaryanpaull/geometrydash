import Link from "next/link";
import { Play, Trophy, Github } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-slate-950 text-white">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center gap-8 p-4">
        {/* Title */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <h1 className="relative text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-white drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-float">
            NEON PULSE
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-slate-300 max-w-lg font-light tracking-wide">
          Rhythm. Reflexes. <span className="text-neon-pink font-bold">Survival.</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <Link href="/game" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
            <button className="relative bg-slate-950 text-white px-8 py-4 rounded-full text-xl font-bold flex items-center gap-2 border border-neon-pink/50 hover:text-neon-pink transition-colors">
              <Play className="w-6 h-6 fill-current" />
              PLAY NOW
            </button>
          </Link>

          <Link href="/leaderboard">
            <button className="px-8 py-4 rounded-full text-xl font-bold flex items-center gap-2 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all glass">
              <Trophy className="w-6 h-6" />
              LEADERBOARD
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-slate-500 text-sm flex items-center gap-4">
        <p>© 2026 Neon Pulse Studios</p>
        <div className="w-px h-4 bg-slate-800" />
        <a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-1">
          <Github className="w-4 h-4" /> Source
        </a>
      </footer>
    </main>
  );
}
