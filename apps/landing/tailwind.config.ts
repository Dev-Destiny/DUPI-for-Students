import type { Config } from 'tailwindcss'
import { solarNeonPreset } from '@dupi/ui/tailwind.config'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" // Include Shared UI styling
  ],
  presets: [solarNeonPreset],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config
