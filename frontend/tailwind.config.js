/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        /* Map Tailwind color names to your CSS variables so utilities like
           bg-background and text-foreground work without errors. Use the
           <alpha-value> token so Tailwind's opacity utilities continue to work. */
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-elevated': 'hsl(var(--surface-elevated) / <alpha-value>)',

        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
        'primary-hover': 'hsl(var(--primary-hover) / <alpha-value>)',

        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
        'secondary-hover': 'hsl(var(--secondary-hover) / <alpha-value>)',

        accent: 'hsl(var(--accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
        'accent-hover': 'hsl(var(--accent-hover) / <alpha-value>)',

        destructive: 'hsl(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
        'destructive-hover': 'hsl(var(--destructive-hover) / <alpha-value>)',

        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',

        muted: 'hsl(var(--muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',

        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',

        /* Sidebar-specific tokens (if used directly as utilities) */
        'sidebar-background': 'hsl(var(--sidebar-background) / <alpha-value>)',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground) / <alpha-value>)',
        'sidebar-primary': 'hsl(var(--sidebar-primary) / <alpha-value>)',
        'sidebar-primary-foreground': 'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
        'sidebar-accent': 'hsl(var(--sidebar-accent) / <alpha-value>)',
        'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
        'sidebar-border': 'hsl(var(--sidebar-border) / <alpha-value>)',
        'sidebar-ring': 'hsl(var(--sidebar-ring) / <alpha-value>)',
      },
      fontFamily: {
        // Expose Poppins via Tailwind so you can use `class="font-poppins"`
        // This points to the CSS variable defined in `src/index.css`.
        poppins: ['var(--font-poppins)'],
        // Expose Salsa so you can use `class="font-salsa"`
        salsa: ['var(--font-salsa)'],
      }
    }
  },
  plugins: []
}
