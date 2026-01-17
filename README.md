# Neon Pulse

A cyberpunk-themed endless runner game built with Next.js, React, and TypeScript. Navigate through neon-lit obstacles, level up through dynamic themes, and compete for the highest score on the leaderboard.

![Neon Pulse Gameplay](https://via.placeholder.com/800x400/0f172a/00ffff?text=Neon+Pulse+Gameplay)

## Features

- **Endless Runner Mechanics**: Jump over spikes and floating blocks in a side-scrolling adventure
- **Dynamic Level Progression**: Unlock new neon themes as you advance (Cyan → Violet → Red)
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Local Leaderboard**: Compete against yourself with persistent score tracking
- **Neon Aesthetics**: Glowing effects, particle systems, and cyberpunk visual style
- **Smooth Controls**: Keyboard (Space/Arrow Up) and touch controls

## Gameplay

- **Objective**: Survive as long as possible by jumping over obstacles
- **Controls**:
  - **Desktop**: Press Space or ↑ Arrow to jump
  - **Mobile**: Tap the screen to jump
- **Scoring**: Earn 100 points for each obstacle cleared
- **Levels**: Advance every 1000 points with visual theme changes
- **Game Over**: Crash into an obstacle and see your final score

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Canvas**: HTML5 Canvas for game rendering

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neon-pulse
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
neon-pulse/
├── app/
│   ├── game/
│   │   └── page.tsx          # Main game component
│   ├── gameover/
│   │   └── page.tsx          # Game over screen
│   ├── leaderboard/
│   │   └── page.tsx          # Leaderboard display
│   ├── globals.css           # Global styles and Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── public/                   # Static assets
├── package.json
├── tailwind.config.js
├── next.config.ts
└── tsconfig.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Game Architecture

### Core Components

- **Game Loop**: Canvas-based rendering with 60fps animation
- **Physics**: Gravity, collision detection, and player movement
- **State Management**: React state for UI, refs for game state
- **Persistence**: LocalStorage for scores and leaderboard

### Key Features

- **Particle Effects**: Explosion effects on game over
- **Theme System**: Dynamic color schemes based on level
- **Obstacle Generation**: Randomized spike and block placement
- **Responsive Canvas**: Adapts to container size changes

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

© 2026 Neon Pulse Studios. All rights reserved.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide](https://lucide.dev)
