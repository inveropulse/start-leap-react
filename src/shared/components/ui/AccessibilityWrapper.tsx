import { useEffect } from "react";
import { useAccessibility } from "@/shared/hooks/useAccessibility";

interface AccessibilityWrapperProps {
  children: React.ReactNode;
}

export function AccessibilityWrapper({ children }: AccessibilityWrapperProps) {
  const { preferences } = useAccessibility();

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    // Apply accessibility preferences to body classes
    body.classList.toggle('reduce-motion', preferences.reduceMotion);
    body.classList.toggle('high-contrast', preferences.highContrast);
    body.classList.toggle('large-text', preferences.largeText);
    
    // Add main content landmark if not present
    if (!document.getElementById('main-content')) {
      const main = document.querySelector('main');
      if (main && !main.id) {
        main.id = 'main-content';
        main.setAttribute('tabindex', '-1');
      }
    }

    // Add lang attribute if not present
    if (!html.lang) {
      html.lang = 'en';
    }

    // Announce accessibility features to screen readers on first load
    if (preferences.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Accessibility features are available. Press the accessibility button in the bottom left to customize your experience.';
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 3000);
    }

  }, [preferences]);

  return <>{children}</>;
}