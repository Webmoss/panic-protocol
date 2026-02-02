export function LandingBackground() {
  return (
    <>
      <div className="pointer-events-none absolute right-6 top-24 hidden h-36 w-36 animate-[spin_28s_linear_infinite] opacity-35 md:block">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10 8"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-24 top-72 hidden h-24 w-24 animate-[spin_24s_linear_infinite] opacity-30 md:block">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="5"
            fill="none"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-24 left-10 hidden h-44 w-44 animate-[spin_38s_linear_infinite] opacity-30 md:block">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle
            cx="60"
            cy="60"
            r="44"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="20"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute -bottom-6 left-64 hidden h-28 w-28 animate-[spin_32s_linear_infinite] opacity-25 md:block">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle
            cx="50"
            cy="50"
            r="26"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="6 6"
          />
        </svg>
      </div>
    </>
  );
}
