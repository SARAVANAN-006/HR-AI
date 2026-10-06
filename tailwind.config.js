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
          DEFAULT: 'var(--color-bg-default, #09090b)',
          panel: 'var(--color-bg-panel, #121215)',
          card: 'var(--color-bg-card, #18181b)',
          elevated: 'var(--color-bg-elevated, #202024)'
        },
        border: {
          DEFAULT: 'var(--color-border, #27272a)',
          active: 'var(--color-border-active, #3f3f46)'
        },
        brand: {
          cyan: {
            DEFAULT: 'var(--color-brand-cyan, #22d3ee)',
            hover: 'var(--color-brand-cyan-hover, #0891b2)',
            dim: 'var(--color-brand-cyan-dim, rgba(34, 211, 238, 0.15))'
          },
          violet: {
            DEFAULT: 'var(--color-brand-violet, #a78bfa)',
            hover: 'var(--color-brand-violet-hover, #7c3aed)',
            dim: 'var(--color-brand-violet-dim, rgba(167, 139, 250, 0.15))'
          },
          emerald: {
            DEFAULT: 'var(--color-brand-emerald, #34d399)',
            hover: 'var(--color-brand-emerald-hover, #059669)',
            dim: 'var(--color-brand-emerald-dim, rgba(52, 211, 153, 0.15))'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        display: ['"Space Grotesk"', 'Syne', 'Outfit', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
