import Noise from "./Noise";
import Squares from "./Squares";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-0 bg-neutral-950 overflow-hidden">
      <div className="absolute inset-0">
        <Squares
          speed={0.3}
          squareSize={60}
          direction="up"
          borderColor="rgba(255,108,23,0.05)"
          hoverFillColor="rgba(255,108,23,0.08)"
          gradientColors={{
            start: "rgba(255,108,23,0.05)",
            end: "rgba(0,0,0,0.8)",
          }}
        />
      </div>

      {/* Effets de lumière orange multiples */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FF6C17]/20 blur-[150px] rounded-full animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#FF6C17]/15 blur-[130px] rounded-full animate-pulse-slower" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-[#FF6C17]/10 blur-[170px] rounded-full animate-float" />
      <div className="absolute top-[40%] right-[15%] w-[300px] h-[300px] bg-[#FF6C17]/15 blur-[120px] rounded-full animate-float-slower" />
      <div className="absolute bottom-[10%] right-[30%] w-[450px] h-[450px] bg-[#FF6C17]/10 blur-[140px] rounded-full animate-pulse" />

      {/* Overlay subtil pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950/80" />

      {/* Ajout du bruit animé */}
      <Noise
        patternSize={240}
        patternScaleX={1}
        patternScaleY={1}
        patternAlpha={15}
        patternRefreshInterval={2}
      />
    </div>
  );
}
