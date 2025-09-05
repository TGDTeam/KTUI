module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0B0B0F',
          green: '#00FF85',
          'green-secondary': '#00FFA3',
          'green-dark': '#00E676'
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.12)'
        },
        text: {
          primary: '#E6EEF3',
          secondary: 'rgba(230, 238, 243, 0.7)'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite'
      }
    }
  },
  plugins: []
}
