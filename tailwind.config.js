/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
     colors:{
        'background-color':'rgb(248,250,252)',

     },
      backgroundImage:{
        'ballon':"url('https://www.ibm.com/blog/wp-content/uploads/2019/08/Leadspace-836099180.jpg')"
      },
      margin:{
        '625px':'625px',
        '100px':'100px'
      },
      colors:{
        'volks':'#5f1939',
        'back':'rgb(100,136,234)',
        'darkblue':'#0000E7'
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

