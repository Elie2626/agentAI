"use client";

const LINE_TOPS = ["top-[10%]", "top-[30%]", "top-[50%]", "top-[70%]", "top-[90%]"];

export function AnimatedHeroBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {/* Subtle indigo grid */}
      <div className="absolute inset-0 animate-grid-move bg-[linear-gradient(hsl(239_84%_67%/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(239_84%_67%/0.05)_1px,transparent_1px)] bg-[length:50px_50px]" />

      {/* Radial glow (kept from original hero) */}
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,hsl(239_84%_67%/0.13),transparent)]" />

      {/* Animated horizontal lines */}
      <div className="absolute inset-0">
        {LINE_TOPS.map((top, i) => (
          <div key={i} className={`absolute w-full h-[100px] ${top}`}>
            <div className="relative w-full h-px overflow-hidden">
              <div
                className="absolute inset-0 animate-line-move"
                style={{
                  animationDirection: i % 2 !== 0 ? "reverse" : "normal",
                  animationDelay: i % 2 !== 0 ? "2s" : "0s",
                  background:
                    "linear-gradient(90deg, transparent 0%, hsl(239 84% 67% / 0.35) 20%, hsl(239 84% 77% / 0.55) 50%, hsl(239 84% 67% / 0.35) 80%, transparent 100%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Corner bracket SVGs — visible md+ */}
      <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" style={{ width: 300, height: 100 }}>
        <svg
          className="absolute left-[-150px] top-1/2 -translate-y-1/2 animate-corner-line"
          width={120} height={60} viewBox="0 0 120 60"
          stroke="hsl(239 84% 67% / 0.5)" strokeWidth="1.5" fill="none" strokeDasharray="50"
        >
          <path d="M120 0 L20 0 Q0 0 0 20 L0 60" />
        </svg>
        <svg
          className="absolute right-[-150px] top-1/2 -translate-y-1/2 scale-x-[-1] animate-corner-line [animation-delay:3s]"
          width={120} height={60} viewBox="0 0 120 60"
          stroke="hsl(239 84% 67% / 0.5)" strokeWidth="1.5" fill="none" strokeDasharray="50"
        >
          <path d="M120 0 L20 0 Q0 0 0 20 L0 60" />
        </svg>
      </div>
    </div>
  );
}
