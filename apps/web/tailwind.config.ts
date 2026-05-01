import type { Config } from 'tailwindcss'
import { solarNeonPreset } from '@studify/ui/tailwind.config'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [solarNeonPreset],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config
