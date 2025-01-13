/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
		sidebar: "rgb(85, 34, 104)", // Colore Viola Profondo in rgb 
    bgProfilo: "rgb(70, 19, 89)",
      },
      backgroundImage: {
        'bg1': "url('/images/bg1.png')",
        'bg2': "url('/images/bg2.png')",
        'logo': "url('/images/logo.png')"
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),],
};