/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f8b92a",
        secondary: "#0b1d30",
        tertiary: "#1c5fd4",
        neutral: "#f5f5f5",
        surface: "#fafafa",
        "on-surface": "#242425",
        muted: "#6b6f76",
        error: "#d92d20",
        border: "#f1f2f3",
      },
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
    },
  },
  plugins: [],
}