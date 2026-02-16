"use client";

import { useState, useRef } from "react";
import TradingCard, { CardData } from "@/components/TradingCard";
import html2canvas from "html2canvas-pro";

// Quiz option choices
const STYLES = ["Boy", "Girl"];
const COLORS = ["Red", "Blue", "Green", "Purple", "Pink", "Gold"];
const PERSONALITIES = ["Brave", "Kind", "Silly", "Mysterious", "Creative", "Gentle"];
const PLACES = ["Forest", "Ocean", "Mountain", "Sky", "Space", "Enchanted Garden"];
const ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dream"];

export default function Home() {
  // Passcode gate
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Quiz state
  const [step, setStep] = useState(0); // 0=style, 1=color, 2=personality, 3=place, 4=element, 5=generating, 6=card
  const [style, setStyle] = useState("");
  const [color, setColor] = useState("");
  const [personality, setPersonality] = useState("");
  const [place, setPlace] = useState("");
  const [element, setElement] = useState("");

  // Card state
  const [card, setCard] = useState<CardData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  // Check passcode
  const handlePasscode = () => {
    if (passcode.toLowerCase() === "sloan") {
      setUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Handle a quiz option selection
  const handleSelect = (value: string) => {
    switch (step) {
      case 0:
        setStyle(value);
        setStep(1);
        break;
      case 1:
        setColor(value);
        setStep(2);
        break;
      case 2:
        setPersonality(value);
        setStep(3);
        break;
      case 3:
        setPlace(value);
        setStep(4);
        break;
      case 4:
        setElement(value);
        generateCard(value);
        break;
    }
  };

  // Call both APIs to generate the card content and image
  const generateCard = async (selectedElement: string) => {
    setStep(5);
    setLoading(true);

    try {
      // Step 1: Generate card content with Claude
      setLoadingMessage("Summoning your spirit animal...");
      const cardResponse = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style,
          color,
          personality,
          place,
          element: selectedElement,
        }),
      });

      if (!cardResponse.ok) throw new Error("Failed to generate card");
      const cardData: CardData = await cardResponse.json();
      setCard(cardData);
      setStep(6);

      // Step 2: Generate the image with DALL-E
      setLoadingMessage("Painting your spirit animal...");
      const imageResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePrompt: cardData.imagePrompt }),
      });

      if (imageResponse.ok) {
        // Convert binary PNG response to a local blob URL
        const blob = await imageResponse.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoadingMessage("Oh no! Something went wrong. Try again!");
      setTimeout(() => resetQuiz(), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Download the card as PNG
  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${card?.name || "spirit-animal"}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Reset everything to start over
  const resetQuiz = () => {
    setStep(0);
    setStyle("");
    setColor("");
    setPersonality("");
    setPlace("");
    setElement("");
    setCard(null);
    setImageUrl(null);
    setLoading(false);
    setLoadingMessage("");
  };

  // Get current question info
  const questions = [
    { title: "Who are you?", options: STYLES, icon: "👋" },
    { title: "What's your favorite color?", options: COLORS, icon: "🎨" },
    { title: "What's your personality like?", options: PERSONALITIES, icon: "💫" },
    { title: "Where's your favorite place?", options: PLACES, icon: "🌍" },
    { title: "Choose your element!", options: ELEMENTS, icon: "⚡" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background sparkles (fixed positions to avoid hydration mismatch) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { l: 5, t: 10, d: 0.2, dur: 2.5 }, { l: 15, t: 80, d: 1.1, dur: 3.2 },
          { l: 25, t: 30, d: 0.5, dur: 4.0 }, { l: 35, t: 60, d: 2.0, dur: 2.8 },
          { l: 45, t: 15, d: 1.5, dur: 3.5 }, { l: 55, t: 90, d: 0.8, dur: 4.2 },
          { l: 65, t: 45, d: 2.5, dur: 2.3 }, { l: 75, t: 70, d: 0.3, dur: 3.8 },
          { l: 85, t: 25, d: 1.8, dur: 4.5 }, { l: 95, t: 55, d: 0.7, dur: 2.6 },
          { l: 10, t: 50, d: 2.2, dur: 3.1 }, { l: 20, t: 5, d: 1.3, dur: 4.3 },
          { l: 30, t: 85, d: 0.1, dur: 2.9 }, { l: 40, t: 40, d: 2.8, dur: 3.6 },
          { l: 50, t: 75, d: 0.9, dur: 4.1 }, { l: 60, t: 20, d: 1.6, dur: 2.4 },
          { l: 70, t: 95, d: 2.3, dur: 3.3 }, { l: 80, t: 35, d: 0.4, dur: 4.4 },
          { l: 90, t: 65, d: 1.9, dur: 2.7 }, { l: 48, t: 48, d: 2.6, dur: 3.9 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${s.l}%`,
              top: `${s.t}%`,
              animationDelay: `${s.d}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Passcode Gate */}
      {!unlocked && (
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 mb-2">
              Baby Spirit Animal
            </h1>
            <p className="text-lg text-purple-200 mb-2">
              Trading Card Creator ✨
            </p>
            <p className="text-sm text-purple-300/70">
              Enter the secret passcode to begin
            </p>
          </div>

          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <input
              type="text"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPasscodeError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasscode()}
              placeholder="Type the magic word..."
              className="w-full text-center text-lg font-bold py-3 px-6 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/30 outline-none focus:border-pink-400 focus:bg-white/15 transition-all"
              autoFocus
            />
            <button
              onClick={handlePasscode}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-black py-3 px-10 rounded-full text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30"
            >
              Enter ✨
            </button>
            {passcodeError && (
              <p className="text-red-400 text-sm font-semibold animate-pulse">
                Hmm, that&apos;s not it! Try again.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Title */}
      {unlocked && (
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 drop-shadow-lg mb-2">
            Baby Spirit Animal
          </h1>
          <p className="text-xl md:text-2xl font-bold text-purple-200">
            Trading Card Creator ✨
          </p>
        </div>
      )}

      {/* Quiz Section (steps 0-4) */}
      {unlocked && step < 5 && (
        <div className="relative z-10 w-full max-w-lg">
          {/* Progress dots */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < step
                    ? "bg-yellow-400 scale-110"
                    : i === step
                    ? "bg-pink-400 scale-125 animate-pulse"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Question */}
          <div className="text-center mb-6">
            <span className="text-4xl mb-2 block">
              {questions[step].icon}
            </span>
            <h2 className="text-2xl font-bold text-white">
              {questions[step].title}
            </h2>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3">
            {questions[step].options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className="bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-purple-500/20"
              >
                {option}
              </button>
            ))}
          </div>

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-4 mx-auto block text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              ← Go Back
            </button>
          )}
        </div>
      )}

      {/* Loading Section (step 5) */}
      {unlocked && step === 5 && (
        <div className="relative z-10 text-center">
          <div className="text-6xl animate-bounce mb-4">🔮</div>
          <p className="text-xl font-bold text-purple-200 animate-pulse">
            {loadingMessage}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card Display Section (step 6) */}
      {unlocked && step === 6 && card && (
        <div className="relative z-10 flex flex-col items-center gap-6">
          <TradingCard ref={cardRef} card={card} imageUrl={imageUrl} />

          {/* Loading indicator for image */}
          {!imageUrl && loading && (
            <p className="text-purple-300 text-sm animate-pulse">
              ✨ {loadingMessage}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={downloadCard}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black py-3 px-8 rounded-full text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/30"
            >
              📥 Download Card
            </button>
            <button
              onClick={resetQuiz}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              🔄 New Card
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
