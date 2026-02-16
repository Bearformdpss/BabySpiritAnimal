"use client";

import { forwardRef } from "react";

// Spirit animal card data structure
export interface CardData {
  name: string;
  element: string;
  personality: string;
  backstory: string;
  stats: {
    courage: number;
    kindness: number;
    magic: number;
  };
  special_move: {
    name: string;
    description: string;
  };
  rarity: string;
  imagePrompt: string;
}

// Element themes — each element gets its own color palette and icon
const elementThemes: Record<
  string,
  { gradient: string; icon: string; glow: string; accent: string }
> = {
  Fire: {
    gradient: "from-orange-500 via-red-500 to-yellow-500",
    icon: "🔥",
    glow: "shadow-[0_0_60px_rgba(255,100,0,0.5)]",
    accent: "text-orange-200",
  },
  Water: {
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    icon: "💧",
    glow: "shadow-[0_0_60px_rgba(0,150,255,0.5)]",
    accent: "text-cyan-200",
  },
  Earth: {
    gradient: "from-green-600 via-emerald-500 to-lime-400",
    icon: "🌿",
    glow: "shadow-[0_0_60px_rgba(0,200,100,0.5)]",
    accent: "text-green-200",
  },
  Air: {
    gradient: "from-sky-300 via-indigo-400 to-purple-400",
    icon: "💨",
    glow: "shadow-[0_0_60px_rgba(150,130,255,0.5)]",
    accent: "text-indigo-200",
  },
  Light: {
    gradient: "from-yellow-300 via-amber-400 to-orange-300",
    icon: "✨",
    glow: "shadow-[0_0_60px_rgba(255,220,50,0.5)]",
    accent: "text-yellow-200",
  },
  Dream: {
    gradient: "from-purple-500 via-pink-500 to-fuchsia-400",
    icon: "🌙",
    glow: "shadow-[0_0_60px_rgba(200,100,255,0.5)]",
    accent: "text-purple-200",
  },
};

interface TradingCardProps {
  card: CardData;
  imageUrl: string | null;
}

// The magical trading card component!
const TradingCard = forwardRef<HTMLDivElement, TradingCardProps>(
  ({ card, imageUrl }, ref) => {
    const theme = elementThemes[card.element] || elementThemes.Dream;

    // Render a stat bar with sparkle fill
    const StatBar = ({
      label,
      value,
      icon,
    }: {
      label: string;
      value: number;
      icon: string;
    }) => (
      <div className="flex items-center gap-2">
        <span className="text-sm w-20">
          {icon} {label}
        </span>
        <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full transition-all duration-1000"
            style={{ width: `${value * 10}%` }}
          />
        </div>
        <span className="text-sm font-bold w-6 text-right">{value}</span>
      </div>
    );

    return (
      <div
        ref={ref}
        className={`relative w-[400px] rounded-2xl overflow-hidden bg-gradient-to-br ${theme.gradient} ${theme.glow} p-1`}
      >
        {/* Inner card */}
        <div className="bg-gray-900/90 rounded-xl overflow-hidden">
          {/* Rarity banner */}
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-center py-1">
            <span className="text-xs font-black tracking-[0.3em] text-yellow-900 uppercase">
              ⭐ {card.rarity} ⭐
            </span>
          </div>

          {/* Card header with name and element */}
          <div className="px-4 pt-3 pb-2 text-center">
            <h2 className="text-2xl font-black text-white tracking-wide drop-shadow-lg">
              {card.name}
            </h2>
            <p className={`text-sm ${theme.accent} font-semibold`}>
              {theme.icon} {card.element} Element {theme.icon}
            </p>
          </div>

          {/* Spirit animal image */}
          <div className="mx-4 rounded-xl overflow-hidden border-2 border-white/20 aspect-square relative bg-gray-800">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl animate-pulse">
                {theme.icon}
              </div>
            )}
          </div>

          {/* Personality */}
          <div className="px-4 pt-3">
            <p className="text-white/90 text-sm italic text-center">
              &ldquo;{card.personality}&rdquo;
            </p>
          </div>

          {/* Backstory */}
          <div className="px-4 pt-2">
            <p className="text-white/70 text-xs leading-relaxed text-center">
              {card.backstory}
            </p>
          </div>

          {/* Power stats */}
          <div className="px-4 pt-3 text-white">
            <div className="space-y-1.5">
              <StatBar label="Courage" value={card.stats.courage} icon="⚔️" />
              <StatBar
                label="Kindness"
                value={card.stats.kindness}
                icon="💖"
              />
              <StatBar label="Magic" value={card.stats.magic} icon="🔮" />
            </div>
          </div>

          {/* Special move */}
          <div className="mx-4 mt-3 mb-4 bg-white/10 rounded-xl p-3 border border-white/20">
            <p className="text-yellow-300 font-black text-sm text-center">
              ⚡ Special Move: {card.special_move.name} ⚡
            </p>
            <p className="text-white/80 text-xs text-center mt-1">
              {card.special_move.description}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

TradingCard.displayName = "TradingCard";

export default TradingCard;
