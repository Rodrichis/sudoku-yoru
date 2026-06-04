/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        marca: {
          arena: "#F5F1ED",
          niebla: "#E8E1D8",
          piedra: "#70798C",
          taupe: "#A99985",
          tinta: "#252323",
          borde: "#D8CFC4",
        },
      },
      boxShadow: {
        tarjeta: "0 8px 26px rgba(37, 35, 35, 0.05)",
      },
    },
  },
  plugins: [],
};
