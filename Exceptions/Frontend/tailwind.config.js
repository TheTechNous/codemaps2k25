/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem'
  	},
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '960px',
  		xl: '1200px'
  	},
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},

        'accent-primary': 'var(--color-primary)',
        'accent-secondary': 'var(--color-secondary)',
  			subtitle: 'var(--color-subtitle)',
  			heading: 'var(--color-heading)',
        tertiary: 'var(--color-tertiary)',
  			lightn: 'var(--color-lightn)',
  			body: 'var(--color-body)',
  			'bg-color-2': 'var(--background-color-2)',
  			'bg-color-op-2': 'var(--background-color-op-2)',
        
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
          '1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
        '4xl': '2rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
        montserrat: [
          'Montserrat',
  				'sans-serif'
  			],
  			poppins: [
          'Poppins',
  				'sans-serif'
  			],
  			cookie: [
          'Cookie',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
        'shadow-1': 'var(--shadow-1)',
        'shadow-1-h': 'var(--shadow-1-h)',
  			'shadow-2': 'var(--shadow-2)',
  			'in-shadow': 'var(--inner-shadow)',
  			'shadow-tabs': 'var(--shadow-tabs)'
  		},
  		backgroundImage: {
        'grad-box-w': 'var(--gradient-box-w)',
  			'grad-hover-yellow': 'var(--gradient-yellow-hover)',
        'card-hov':'var(--gradient-card-h)',
        'bg-color-1': 'var(--background-color-1)',
  		},
  		transitionDuration: {
  			'400': '400ms'
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
