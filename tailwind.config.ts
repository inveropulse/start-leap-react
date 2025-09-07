import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./apps/**/*.{ts,tsx}",
    "./packages/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        enterprise: {
          primary: "hsl(var(--enterprise-primary))",
          secondary: "hsl(var(--enterprise-secondary))",
          accent: "hsl(var(--enterprise-accent))",
          surface: "hsl(var(--enterprise-surface))",
          "surface-dark": "hsl(var(--enterprise-surface-dark))",
        },
        portal: {
          internal: {
            primary: "hsl(var(--portal-internal-primary))",
            secondary: "hsl(var(--portal-internal-secondary))",
            accent: "hsl(var(--portal-internal-accent))",
            background: "hsl(var(--portal-internal-background))",
          },
          clinic: {
            primary: "hsl(var(--portal-clinic-primary))",
            secondary: "hsl(var(--portal-clinic-secondary))",
            accent: "hsl(var(--portal-clinic-accent))",
            background: "hsl(var(--portal-clinic-background))",
          },
          patient: {
            primary: "hsl(var(--portal-patient-primary))",
            secondary: "hsl(var(--portal-patient-secondary))",
            accent: "hsl(var(--portal-patient-accent))",
            background: "hsl(var(--portal-patient-background))",
          },
          sedationist: {
            primary: "hsl(var(--portal-sedationist-primary))",
            secondary: "hsl(var(--portal-sedationist-secondary))",
            accent: "hsl(var(--portal-sedationist-accent))",
            background: "hsl(var(--portal-sedationist-background))",
          },
        },
      },
      backgroundImage: {
        "gradient-enterprise": "var(--gradient-enterprise)",
        "gradient-surface": "var(--gradient-surface)",
        "gradient-portal-internal": "var(--gradient-portal-internal)",
        "gradient-portal-clinic": "var(--gradient-portal-clinic)",
        "gradient-portal-patient": "var(--gradient-portal-patient)",
        "gradient-portal-sedationist": "var(--gradient-portal-sedationist)",
      },
      boxShadow: {
        enterprise: "var(--shadow-enterprise)",
        "enterprise-lg": "var(--shadow-enterprise-lg)",
        elegant: "var(--shadow-elegant)",
      },
      transitionProperty: {
        smooth: "var(--transition-smooth)",
        bounce: "var(--transition-bounce)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Existing keyframes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        
        // Enhanced animation keyframes
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.9)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "stagger-fade": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 5px hsl(var(--primary) / 0.3)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 20px hsl(var(--primary) / 0.6)" },
        },
      },
      animation: {
        // Existing animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-from-bottom": "slide-in-from-bottom 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-out-to-bottom": "slide-out-to-bottom 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        
        // Enhanced animations
        "fade-in": "fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-out": "fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-out": "scale-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "stagger-fade": "stagger-fade 0.4s cubic-bezier(0.4, 0, 0.2, 1) both",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        
        // Timing variants
        "fade-in-fast": "fade-in 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in-slow": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in-fast": "scale-in 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up-fast": "slide-up 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
