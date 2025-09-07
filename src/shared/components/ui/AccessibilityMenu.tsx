import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Switch } from "./switch";
import { 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  MousePointer2,
  Settings,
  X
} from "lucide-react";
import { useAccessibility } from "@/shared/hooks/useAccessibility";
import { useKeyboardNavigation } from "@/shared/hooks/useKeyboardNavigation";
import { clsx } from "clsx";

interface AccessibilityMenuProps {
  className?: string;
}

export function AccessibilityMenu({ className }: AccessibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, togglePreference, announceToScreenReader } = useAccessibility();
  
  const { handleKeyDown } = useKeyboardNavigation({
    onEscape: () => setIsOpen(false),
    enabled: isOpen,
  });

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyDown(e.nativeEvent);
  };

  const handleToggle = (key: keyof typeof preferences, label: string) => {
    togglePreference(key);
    const newValue = !preferences[key];
    announceToScreenReader(`${label} ${newValue ? 'enabled' : 'disabled'}`);
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={clsx("fixed bottom-4 left-4 z-50", className)}
        aria-label="Open accessibility menu"
      >
        <Accessibility className="w-4 h-4" />
        <span className="sr-only">Accessibility Options</span>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card 
        className="w-80 shadow-lg"
        onKeyDown={handleCardKeyDown}
        role="dialog"
        aria-labelledby="accessibility-menu-title"
        aria-modal="true"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle id="accessibility-menu-title" className="text-base flex items-center gap-2">
            <Accessibility className="w-4 h-4" />
            Accessibility Options
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility menu"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium">Reduce Motion</div>
                <div className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.reduceMotion}
              onCheckedChange={() => handleToggle('reduceMotion', 'Reduce motion')}
              aria-describedby="reduce-motion-desc"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium">High Contrast</div>
                <div className="text-xs text-muted-foreground">
                  Increase color contrast for better visibility
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.highContrast}
              onCheckedChange={() => handleToggle('highContrast', 'High contrast')}
              aria-describedby="high-contrast-desc"
            />
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium">Large Text</div>
                <div className="text-xs text-muted-foreground">
                  Increase text size for better readability
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.largeText}
              onCheckedChange={() => handleToggle('largeText', 'Large text')}
              aria-describedby="large-text-desc"
            />
          </div>

          {/* Screen Reader Optimizations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium">Screen Reader</div>
                <div className="text-xs text-muted-foreground">
                  Enhanced support for screen readers
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.screenReader}
              onCheckedChange={() => handleToggle('screenReader', 'Screen reader optimizations')}
              aria-describedby="screen-reader-desc"
            />
          </div>

          {/* Status */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Active preferences:</span>
              <Badge variant="outline">
                {Object.values(preferences).filter(Boolean).length}
              </Badge>
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="pt-2 text-xs text-muted-foreground">
            <div className="font-medium mb-1">Keyboard shortcuts:</div>
            <div>• Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close</div>
            <div>• Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> to navigate</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}