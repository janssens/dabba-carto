module.exports = {
  mode: 'jit', // Just-In-Time Compiler
  purge: ['./template.php'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        '2xs': '.5rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}