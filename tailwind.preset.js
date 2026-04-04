/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--color-bg)",
          card: "var(--color-bg-card)",
          "card-hi": "var(--color-bg-card-hi)",
          hover: "var(--color-bg-hover)",
        },
        fg: {
          DEFAULT: "var(--color-fg)",
          muted: "var(--color-fg-muted)",
          faint: "var(--color-fg-faint)",
        },
        status: {
          ok: "#34d399",
          warn: "#f59e0b",
          error: "#ef4444",
        },
        accent: {
          DEFAULT: "#60a5fa",
          muted: "rgba(96,165,250,0.15)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          hi: "var(--color-border-hi)",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "SF Mono", "Consolas", "monospace"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "10px",
        xs: "8px",
      },
      keyframes: {
        breathe: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        "beacon-glow": {
          "0%, 100%": { boxShadow: "0 0 6px 2px currentColor" },
          "50%": { boxShadow: "0 0 16px 6px currentColor" },
        },
        "led-blink": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
        "alert-pulse": {
          "0%, 100%": { borderLeftColor: "var(--alert-color)" },
          "50%": { borderLeftColor: "transparent" },
        },
      },
      animation: {
        breathe: "breathe 3s ease-in-out infinite",
        blink: "blink 1.2s step-end infinite",
        "beacon-glow": "beacon-glow 2.5s ease-in-out infinite",
        "led-blink": "led-blink 1.5s ease-in-out infinite",
        "alert-pulse": "alert-pulse 2s ease-in-out infinite",
      },
    },
  },
};
