import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export const solarNeonPreset = {
	darkMode: "class",
	content: [],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1280px",
			},
		},
		extend: {
			colors: {
				// New Design Brand Colors
				primary: {
					DEFAULT: "#FF6F20", // Vibrant Orange
					foreground: "#ffffff",
					soft: "rgba(255, 111, 32, 0.1)",
				},
				"brand-violet": {
					DEFAULT: "#62109F", // Deep Purple
					dark: "#4a0b7a",
					soft: "rgba(98, 16, 159, 0.1)",
					foreground: "#ffffff",
				},
				"brand-orange": {
					DEFAULT: "#FF6F20", // Vibrant Orange
					dark: "#e05a10",
					soft: "rgba(255, 111, 32, 0.1)",
					foreground: "#ffffff",
				},
				"brand-gold": {
					DEFAULT: "#FFD54F", // Gold/Yellow
					foreground: "#000000",
				},
				"background-light": "#FAF9F6",
				"background-dark": "#09090B",
				// shadcn/ui semantic colors
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontFamily: {
				serif: ["'Lora'", "Georgia", "serif"],
				sans: ["Inter", "system-ui", "sans-serif"],
				grotesk: ["'Space Grotesk'", "system-ui", "sans-serif"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				"2xl": "1rem",
				"3xl": "1.5rem",
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-up": "fade-up 0.5s ease-out forwards",
				"fade-in": "fade-in 0.5s ease-out forwards",
				"dash-flow": "dash-flow 2s linear infinite",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-up": {
					from: { opacity: "0", transform: "translateY(20px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"dash-flow": {
					to: { strokeDashoffset: "-24" },
				},
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
