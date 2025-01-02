import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          blue: '#5A8FF6',
          purple: '#996BEE',
        }
      },
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 50%'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)'
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.02)'
          }
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
