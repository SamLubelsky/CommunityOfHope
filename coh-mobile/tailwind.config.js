/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      pink: colors.pink,
      red: colors.red,  
      green: colors.green,
      gray: colors.zinc,
      blue: colors.cyan,
      white: colors.white,
      yellow: colors.yellow,
      amber: colors.amber,
    },
    spacing:{
      '1':'4px',
      '2':'8px',
      '3':'12px',
      '4':'16px',
      '5':'24px',
      '6':'32px',
      '7':'48px',
      '8':'64px',
      '9':'96px',
      '10':'128px',
      '11':'192px',
      '12':'256px',
      '13':'384px',
      '14':'512px',
      '15':'640px',
      '16':'768px', 
    },
    fontSize: {
      '1':'12px',
      '2':'14px',
      '3':'16px',
      '4':'18px',
      '5':'20px',
      '6':'24px',
      '7':'30px',
      '8':'36px',
      '9':'48px',
      '10':'60px',
      '11':'72px',
    },
    fontFamily: {
      // 'primary': ['Roboto', 'sans-serif', 'system-ui'], 
      'primary': ['Roboto'],
    },
    fontWeight: {
      '1':'100',
      '2':'200',
      '3':'300',
      '4':'400',
      '5':'500',
      '6':'600',
      '7':'700',
      '8':'800',
      '9':'900',  
    },
    extend: {}, 
  },
  plugins: [],
}

