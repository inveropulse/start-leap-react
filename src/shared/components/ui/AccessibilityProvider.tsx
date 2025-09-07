import { createContext, useContext, useEffect } from "react";
import { useAccessibility } from "@/shared/hooks/useAccessibility";

interface AccessibilityContextType {
  preferences: ReturnType<typeof useAccessibility>['preferences'];
  togglePreference: ReturnType<typeof useAccessibility>['togglePreference'];
  announceToScreenReader: ReturnType<typeof useAccessibility>['announceToScreenReader'];
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const accessibility = useAccessibility();

  useEffect(() => {
    // Apply global accessibility classes
    document.documentElement.classList.toggle('reduce-motion', accessibility.preferences.reduceMotion);
    document.documentElement.classList.toggle('high-contrast', accessibility.preferences.highContrast);
    document.documentElement.classList.toggle('large-text', accessibility.preferences.largeText);
    
    // Set up ARIA live region for announcements
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    // Meta tags for accessibility
    if (!document.querySelector('meta[name="color-scheme"]')) {
      const colorScheme = document.createElement('meta');
      colorScheme.name = 'color-scheme';
      colorScheme.content = 'light dark';
      document.head.appendChild(colorScheme);
    }

    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#ffffff';
      document.head.appendChild(themeColor);
    }

  }, [accessibility.preferences]);

  return (
    <AccessibilityContext.Provider value={accessibility}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider');
  }
  return context;
}