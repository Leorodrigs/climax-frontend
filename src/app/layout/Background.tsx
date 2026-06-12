import React from "react";

interface AppBackgroundProps {
  children: React.ReactNode;
}

export function Background({ children }: AppBackgroundProps) {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        fontFamily: "Inter, sans-serif",
        background:
          "linear-gradient(145deg, #0c1a2e 0%, #0a2540 18%, #0c2d4a 35%, #0f2a5e 55%, #1a1260 70%, #250d50 85%, #1a0a38 100%)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: "-100px",
            left: "-100px",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: "40%",
            right: "-80px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            bottom: "5%",
            left: "30%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
