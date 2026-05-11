export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],

  theme: {
    extend: {
      boxShadow: {
        top: "0px 0px 3px 0px rgba(0, 0, 0, 0.25)",
        card: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
      },
    },
    colors: {
      primary: "#3D8926",
      black: "#000",
      white: "#fff",
      red: "red",
      green: "green",
      yellow: "#E6BB4E",
      gray: "#e8e8e8",
      orange: "orange",
      tertiary: "#FFB700",
      "black-half": "rgba(0, 0, 0, 0.5)",
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },

    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
