/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "hero-sub": "hsl(var(--hero-sub))",
      },
      fontFamily: {
        sans: ['"Geist Sans"', "system-ui", "sans-serif"],
        headline: ['"General Sans"', '"Geist Sans"', "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(168, 85, 247, 0.16)" },
          "50%": { boxShadow: "0 0 54px rgba(99, 102, 241, 0.42)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
        "glow-pulse": "glowPulse 1.7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
