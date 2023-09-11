/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        'barlow-semi-condensed': ['Barlow Semi Condensed', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 0 5px #0f81ba, 0 0 10px #0d6794, 0 0 15px #2ea4df, 0 2px 0 black',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 28.39% 12.57%, #0488c0 0, #0580b9 25%, #17547b 50%, #17547b 75%, #132e44 100%)',
      }
    },
  },
  plugins: [],
}

