"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pause, Play } from "lucide-react";

// --- Constants ---
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const SPEED = 6;
const OBSTACLE_INTERVAL = 1500; // ms
const GROUND_HEIGHT = 100;

type GameState = "START" | "PLAYING" | "GAME_OVER";

interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    dy: number;
    rotation: number;
    grounded: boolean;
}

interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    type: "spike" | "block";
    passed: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

// Helper to determine theme based on level
const getTheme = (level: number) => {
    // Level 1: Default Slate/Cyan
    if (level === 1) return { bg: "#020617", grid: "rgba(40, 255, 255, 0.1)", ground: "#0f172a", accent: "#00ffff" };
    // Level 2: Synthwave Violet
    if (level === 2) return { bg: "#1a0b2e", grid: "rgba(255, 0, 255, 0.15)", ground: "#2d1b4e", accent: "#fb00ff" };
    // Level 3: Danger Red
    if (level >= 3) return { bg: "#2a0a0a", grid: "rgba(255, 50, 50, 0.2)", ground: "#450a0a", accent: "#ff3333" };

    return { bg: "#020617", grid: "rgba(40, 255, 255, 0.1)", ground: "#0f172a", accent: "#00ffff" };
}

export default function GamePage() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // React State for UI overlays (score, level)
    const [gameState, setGameState] = useState<GameState>("START");
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);

    // Game Mutable State (Refs)
    const stateRef = useRef({
        isPlaying: false,
        score: 0,
        level: 1,
        startTime: 0,
        lastObstacleTime: 0,
        player: {
            x: 100,
            y: 0,
            width: 40,
            height: 40,
            dy: 0,
            rotation: 0,
            grounded: false,
        } as Player,
        obstacles: [] as Obstacle[],
        particles: [] as Particle[],
    });

    const jump = () => {
        const s = stateRef.current;
        if (s.player.grounded) {
            s.player.dy = JUMP_FORCE;
            s.player.grounded = false;
        }
    };

    // --- Input Handling ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                if (gameState === "START") {
                    setGameState("PLAYING");
                    stateRef.current.isPlaying = true;
                    stateRef.current.startTime = Date.now();
                    stateRef.current.lastObstacleTime = Date.now();
                    jump();
                } else if (gameState === "PLAYING") {
                    jump();
                }
            }
        };

        const handleTouchStart = () => {
            if (gameState === "START") {
                setGameState("PLAYING");
                stateRef.current.isPlaying = true;
                stateRef.current.startTime = Date.now();
                stateRef.current.lastObstacleTime = Date.now();
                jump();
            } else if (gameState === "PLAYING") {
                jump();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("touchstart", handleTouchStart);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("touchstart", handleTouchStart);
        };
    }, [gameState]);

    // --- Game Loop ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resizeConsumer = () => {
            if (containerRef.current && canvas) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };
        window.addEventListener('resize', resizeConsumer);
        resizeConsumer();

        const createServerObstacle = (canvasWidth: number, canvasHeight: number) => {
            const type = Math.random() > 0.5 ? "spike" : "block";
            const groundY = canvasHeight - GROUND_HEIGHT;
            let width = 40;
            let height = 40;
            let y = groundY - height;

            if (type === "spike") {
                width = 40;
                height = 40;
            } else {
                if (Math.random() > 0.7) {
                    y = groundY - 100; // Floating block
                }
            }

            return { x: canvasWidth, y, width, height, type, passed: false } as Obstacle;
        };

        const spawnParticles = (x: number, y: number, color: string) => {
            for (let i = 0; i < 20; i++) {
                stateRef.current.particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.0,
                    color
                });
            }
        }

        const gameOver = () => {
            stateRef.current.isPlaying = false;
            setGameState("GAME_OVER");
            spawnParticles(stateRef.current.player.x, stateRef.current.player.y, "#00ffff");

            const currentScore = stateRef.current.score;
            localStorage.setItem("neon-pulse-last-score", currentScore.toString());

            const leaderboard = JSON.parse(localStorage.getItem("neon-pulse-leaderboard") || "[]");
            leaderboard.push({ name: "Player", score: currentScore, date: new Date().toISOString() });
            leaderboard.sort((a: any, b: any) => b.score - a.score);
            localStorage.setItem("neon-pulse-leaderboard", JSON.stringify(leaderboard.slice(0, 10)));

            setTimeout(() => {
                router.push("/gameover");
            }, 1000);
        };

        const render = () => {
            if (!canvas || !ctx) return;
            const { width, height } = canvas;
            const s = stateRef.current;
            const groundY = height - GROUND_HEIGHT;

            // Determine Theme
            const currentTheme = getTheme(s.level);

            // Clear & Draw Dynamic Background
            ctx.fillStyle = currentTheme.bg;
            ctx.fillRect(0, 0, width, height);

            // Moving Grid Lines
            ctx.strokeStyle = currentTheme.grid;
            ctx.lineWidth = 1;
            const gridOffset = (Date.now() * 0.1) % 40;
            for (let i = -gridOffset; i < width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, height);
                ctx.stroke();
            }

            // Draw Ground
            ctx.fillStyle = currentTheme.ground;
            ctx.fillRect(0, groundY, width, GROUND_HEIGHT);
            ctx.strokeStyle = currentTheme.accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(width, groundY);
            ctx.stroke();

            if (gameState === "PLAYING" || gameState === "GAME_OVER") {
                if (s.isPlaying) {
                    // Physics
                    s.player.dy += GRAVITY;
                    s.player.y += s.player.dy;

                    // Ground Collision
                    if (s.player.y + s.player.height >= groundY) {
                        s.player.y = groundY - s.player.height;
                        s.player.dy = 0;
                        s.player.grounded = true;
                        s.player.rotation = Math.round(s.player.rotation / 90) * 90;
                    } else {
                        s.player.grounded = false;
                        s.player.rotation += 5;
                    }

                    // Ceiling Collision
                    if (s.player.y < 0) {
                        s.player.y = 0;
                        s.player.dy = 0;
                    }

                    // Obstacles
                    const now = Date.now();
                    if (now - s.lastObstacleTime > OBSTACLE_INTERVAL) {
                        s.obstacles.push(createServerObstacle(width, height));
                        s.lastObstacleTime = now;
                    }

                    for (let i = s.obstacles.length - 1; i >= 0; i--) {
                        const obs = s.obstacles[i];
                        obs.x -= SPEED;

                        if (obs.x + obs.width < 0) {
                            s.obstacles.splice(i, 1);
                            continue;
                        }

                        // Collision
                        const grace = 5;
                        if (
                            s.player.x + grace < obs.x + obs.width - grace &&
                            s.player.x + s.player.width - grace > obs.x + grace &&
                            s.player.y + grace < obs.y + obs.height - grace &&
                            s.player.y + s.player.height - grace > obs.y + grace
                        ) {
                            gameOver();
                        }

                        // Score & Level Logic
                        if (!obs.passed && obs.x + obs.width < s.player.x) {
                            obs.passed = true;
                            s.score += 100;
                            setScore(s.score);

                            // Level Up every 1000 points
                            const newLevel = Math.floor(s.score / 1000) + 1;
                            if (newLevel > s.level) {
                                s.level = newLevel;
                                setLevel(newLevel);
                            }
                        }
                    }
                }

                // Draw Player
                if (gameState !== "GAME_OVER") {
                    ctx.save();
                    ctx.translate(s.player.x + s.player.width / 2, s.player.y + s.player.height / 2);
                    ctx.rotate((s.player.rotation * Math.PI) / 180);
                    ctx.fillStyle = currentTheme.accent;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = currentTheme.accent;
                    ctx.fillRect(-s.player.width / 2, -s.player.height / 2, s.player.width, s.player.height);
                    ctx.restore();
                }

                // Draw Obstacles
                s.obstacles.forEach(obs => {
                    ctx.save();
                    ctx.shadowBlur = 10;
                    if (obs.type === "spike") {
                        ctx.fillStyle = "#ff0000";
                        ctx.shadowColor = "#ff0000";
                        ctx.beginPath();
                        ctx.moveTo(obs.x, obs.y + obs.height);
                        ctx.lineTo(obs.x + obs.width / 2, obs.y);
                        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                        ctx.fill();
                    } else {
                        ctx.fillStyle = "#bf00ff";
                        ctx.shadowColor = "#bf00ff";
                        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                    }
                    ctx.restore();
                });

                // Particles
                for (let i = s.particles.length - 1; i >= 0; i--) {
                    const p = s.particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= 0.02;
                    if (p.life <= 0) {
                        s.particles.splice(i, 1);
                    } else {
                        ctx.globalAlpha = p.life;
                        ctx.fillStyle = p.color;
                        ctx.fillRect(p.x, p.y, 4, 4);
                        ctx.globalAlpha = 1.0;
                    }
                }
            } else {
                // START SCREEN
                const s = stateRef.current;
                const currentTheme = getTheme(1); // Force level 1 theme on start
                s.player.y = groundY - s.player.height;
                ctx.save();
                ctx.translate(s.player.x + s.player.width / 2, s.player.y + s.player.height / 2);
                ctx.fillStyle = currentTheme.accent;
                ctx.shadowBlur = 20;
                ctx.shadowColor = currentTheme.accent;
                ctx.fillRect(-s.player.width / 2, -s.player.height / 2, s.player.width, s.player.height);
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeConsumer);
        };
    }, [gameState, router]);

    return (
        <div ref={containerRef} className="width-full height-screen relative overflow-hidden bg-slate-950">
            <div className="absolute top-4 left-4 z-10">
                <Link href="/">
                    <button className="p-2 rounded-full bg-slate-900/50 text-white hover:bg-white/20 transition backdrop-blur-md">
                        <ArrowLeft />
                    </button>
                </Link>
            </div>

            <div className="absolute top-4 right-4 z-10 flex flex-col items-end pointer-events-none">
                <div className="font-mono text-xl text-neon-cyan/80 font-bold tracking-widest mb-1">
                    LEVEL {level}
                </div>
                <div className="font-mono text-4xl text-white font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {score.toString().padStart(6, '0')}
                </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                {gameState === "START" && (
                    <div className="text-center animate-pulse">
                        <h2 className="text-4xl text-neon-cyan mb-4 font-bold">PRESS SPACE TO START</h2>
                        <p className="text-slate-400">Jump over Spikes and Blocks</p>
                    </div>
                )}
            </div>

            <canvas
                ref={canvasRef}
                className="block w-full h-[100vh]"
            />
        </div>
    );
}
