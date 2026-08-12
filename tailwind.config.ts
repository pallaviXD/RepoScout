import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Light theme — monopo saigon design system
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // monopo saigon palette — strict monochrome
        obsidian:    '#000000', // primary text, strokes, overlay fills
        paper:       '#ffffff', // primary canvas, inverse labels
        inkstone:    '#181818', // footer body, secondary headings
        'felt-gray': '#6d6d6d', // muted helper text, address blocks
        'slate-pill':'#636363', // filled neutral button background
        'ash-mist':  '#9a9a9a', // disabled/low-contrast surfaces
        pewter:      '#808080', // hover/muted state layers

        // Semantic aliases matching existing usage patterns
        background:  '#ffffff',
        foreground:  '#000000',
        card: {
          DEFAULT: '#ffffff',
          hover:   '#fafafa',
          border:  'rgba(0,0,0,0.12)',
        },
        primary: {
          DEFAULT: '#000000',
          hover:   '#181818',
          light:   '#363636',
          dark:    '#000000',
        },
        secondary: {
          DEFAULT:    '#f5f5f5',
          foreground: '#6d6d6d',
        },
        accent: {
          DEFAULT: '#000000',
          purple:  '#000000',
          amber:   '#000000',
          rose:    '#000000',
        },
        muted: {
          DEFAULT:    'rgba(0,0,0,0.06)',
          foreground: '#6d6d6d',
        },
        border: 'rgba(0,0,0,0.12)',
      },

      fontFamily: {
        // Roobert substitute — Inter
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        roobert: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        raleway: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      fontSize: {
        // monopo saigon type scale
        'label':        ['11px', { lineHeight: '1.36' }],
        'caption':      ['12px', { lineHeight: '1.19' }],
        'body-sm':      ['16px', { lineHeight: '1.15' }],
        'body':         ['18px', { lineHeight: '1.21' }],
        'subheading':   ['39px', { lineHeight: '1.19' }],
        'subheading-lg':['45px', { lineHeight: '1.15' }],
        'heading-sm':   ['54px', { lineHeight: '1.39' }],
        'heading':      ['78px', { lineHeight: '1.1'  }],
        'heading-lg':   ['94px', { lineHeight: '0.76' }],
        'display':      ['225px',{ lineHeight: '1.25' }],
      },

      fontWeight: {
        light:    '300',
        regular:  '400',
        semibold: '600',
      },

      spacing: {
        '8':   '8px',
        '12':  '12px',
        '28':  '28px',
        '40':  '40px',
        '48':  '48px',
        '64':  '64px',
        '68':  '68px',
        '152': '152px',
      },

      borderRadius: {
        'none': '0px',
        'pill': '75px',   // monopo full-pill (buttons, tags)
        'sm':   '4px',    // subtle rounding for small elements
        DEFAULT:'6px',
        'md':   '8px',
        'lg':   '12px',   // cards, modals
        'xl':   '16px',   // feature cards on landing
        '2xl':  '20px',   // large hero cards
        '3xl':  '24px',
        'full': '75px',   // alias
      },

      maxWidth: {
        'page': '1078px',  // monopo container
        '5xl':  '64rem',
        '7xl':  '80rem',
      },

      // No box-shadows — monopo system uses flat surfaces + hairline borders
      boxShadow: {
        'none':    'none',
        'glow-sm': '0 0 0 1px rgba(34,197,94,0.2), 0 2px 8px rgba(0,0,0,0.08)',
        'glow-md': '0 0 0 2px rgba(34,197,94,0.2), 0 4px 16px rgba(0,0,0,0.12)',
        DEFAULT:   '0 1px 3px rgba(0,0,0,0.06)',
        'sm':      '0 1px 2px rgba(0,0,0,0.04)',
        'md':      '0 2px 8px rgba(0,0,0,0.08)',
        'lg':      '0 4px 16px rgba(0,0,0,0.1)',
        'xl':      '0 8px 32px rgba(0,0,0,0.12)',
        '2xl':     '0 16px 48px rgba(0,0,0,0.16)',
        'inner':   'inset 0 1px 4px rgba(0,0,0,0.06)',
      },

      transitionTimingFunction: {
        // monopo signature easing
        'expressive': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'micro':      'ease',
      },

      transitionDuration: {
        '400':  '400ms',
        '800':  '800ms',
        '1000': '1000ms',
        '1250': '1250ms',
      },

      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },

      lineHeight: {
        'display': '1.25',
        'tight-editorial': '0.76',
        'heading-lg': '0.76',
      },
    },
  },
  plugins: [],
};

export default config;
