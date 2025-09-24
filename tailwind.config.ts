import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#d97706", // amber-600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#374151", // gray-700
        },
        background: "#ffffff",
        foreground: "#111827", // gray-900
        card: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
        muted: {
          DEFAULT: "#f9fafb", // gray-50
          foreground: "#6b7280", // gray-500
        },
        accent: {
          DEFAULT: "#059669", // emerald-600
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#dc2626", // red-600
          foreground: "#ffffff",
        },
        border: "#e5e7eb", // gray-200
        input: "#e5e7eb",
        ring: "#d97706", // amber-600
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
