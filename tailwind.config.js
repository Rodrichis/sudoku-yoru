/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        marca: {
          arena: "#f7f1e3",
          cobre: "#c96b3b",
          petroleo: "#113946",
          espuma: "#fffaf2",
          borde: "#dfd3c3",
        },
      },
      boxShadow: {
        tarjeta: "0 12px 40px rgba(17, 57, 70, 0.12)",
      },
    },
  },
  plugins: [],
};
