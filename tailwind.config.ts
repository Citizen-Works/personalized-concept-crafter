
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem'
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
				serif: ['Georgia', 'serif'],
				cursive: ['Dancing Script', 'cursive'],
			},
			colors: {
				// Brand colors
				primary: {
					DEFAULT: '#AE3899',
					50: '#F9E6F5',
					100: '#F3CEE9',
					200: '#E7A8D7',
					300: '#D779BD',
					400: '#C14EA9',
					500: '#AE3899',
					600: '#872A77',
					700: '#612056',
					800: '#3B1534',
					900: '#1D0B1A',
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#00EFDF',
					50: '#E6FDFB',
					100: '#CCFBF8',
					200: '#99F8F1',
					300: '#66F4EA',
					400: '#33F1E4',
					500: '#00EFDF',
					600: '#00BAB0',
					700: '#008B84',
					800: '#005B57',
					900: '#002E2D',
					foreground: '#0A0B0B',
				},
				accent: {
					DEFAULT: '#D15569',
					50: '#FBE8EB',
					100: '#F7D2D8',
					200: '#EEA5B1',
					300: '#E5788A',
					400: '#DB4A64',
					500: '#D15569',
					600: '#B62E44',
					700: '#872232',
					800: '#581720',
					900: '#2C0B10',
					foreground: '#FFFFFF',
				},
				teal: {
					DEFAULT: '#087E8B',
					50: '#E6F3F5',
					100: '#CCE7EA',
					200: '#99CFD5',
					300: '#66B7C0',
					400: '#339FAB',
					500: '#087E8B',
					600: '#06616C',
					700: '#044954',
					800: '#033037',
					900: '#01181B',
					foreground: '#FFFFFF',
				},
				dark: {
					DEFAULT: '#0A0B0B',
					50: '#F2F2F2',
					100: '#E6E6E6',
					200: '#CCCCCC',
					300: '#B3B3B3',
					400: '#999999',
					500: '#808080',
					600: '#666666',
					700: '#4D4D4D',
					800: '#333333',
					900: '#0A0B0B',
					foreground: '#FFFFFF',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-in-from-left': {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' }
				},
				'slide-in-from-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'fade-out': 'fade-out 0.3s ease-in-out',
				'slide-in-from-left': 'slide-in-from-left 0.3s ease-in-out',
				'slide-in-from-right': 'slide-in-from-right 0.3s ease-in-out',
				'scale-in': 'scale-in 0.2s ease-in-out',
				'pulse-subtle': 'pulse-subtle 2s infinite'
			},
			screens: {
				'xs': '475px',
				'3xl': '1600px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
