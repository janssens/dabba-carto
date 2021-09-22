module.exports = {
  mode: 'jit', // Just-In-Time Compiler
  purge: ['./template.php','./include.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      'xs': '1rem',
      'sm': '1.2rem',
      'base': '1.4rem',
      'lg': '1.6rem',
      'xl': '1.8rem',
      '2xl': '2rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}