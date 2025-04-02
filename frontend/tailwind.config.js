import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ea582f',
        secondary: '#FF6B6B',
        accent: '#FF6B6B',
      },
      fontFamily: {
        sans: ['Alexandria', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ea582f",
          secondary: "#FF6B6B",
          accent: "#FF6B6B",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
}
