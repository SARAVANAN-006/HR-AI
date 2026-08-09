/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#09090b', // near-black
          panel: '#121215',      // dark graphite
          card: '#18181b',       // slate-grey
          elevated: '#202024'    // lighter panel
        },
        border: {
          DEFAULT: '#27272a',    // 1px border graphite
          active: '#3f3f46'      // highlighted border
        },
        brand: {
          cyan: {
            DEFAULT: '#22d3ee',  // electric cyan
            hover: '#0891b2',
            dim: 'rgba(34, 211, 238, 0.15)'
          },
          violet: {
            DEFAULT: '#a78bfa',  // soft violet
            hover: '#7c3aed',
            dim: 'rgba(167, 139, 250, 0.15)'
          },
          emerald: {
            DEFAULT: '#34d399',  // emerald
            hover: '#059669',
            dim: 'rgba(52, 211, 153, 0.15)'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
