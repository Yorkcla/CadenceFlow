module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'], 
        sans: ['Lato', 'sans-serif'],   
      },
      typography: (theme) => ({
        lato: {
          css: {
            fontFamily: theme('fontFamily.lato').join(','),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

  
  