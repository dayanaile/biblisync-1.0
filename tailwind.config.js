/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
  themes: [
    {
      libris: {
        "primary": "#FCA72C",
        "base-100": "#ffffff", // Garante que o fundo seja branco
        // ... restante das suas cores
      },
    },
    "dark", // O dark vem depois
  ],
},
}