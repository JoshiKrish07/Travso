/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlack: '#364045', 
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontFamilyData: {
        datafamily: ['Noto Sans'],
      },
    },
  },
  plugins: [],
}

