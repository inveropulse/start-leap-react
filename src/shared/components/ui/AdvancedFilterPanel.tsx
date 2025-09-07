import { useState, forwardRef, ReactNode } from "react";
import { ChevronDown, ChevronUp, Save, X, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { Separator } from "@/shared/components/ui/separator";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
  isDefault?: boolean;
  count?: number;
}

export interface FilterSection {
  id: string;
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  presets?: FilterPreset[];
  onSavePreset?: (name: string, filters: Record<string, any>) => void;
  onLoadPreset?: (preset: FilterPreset) => void;
  onDeletePreset?: (presetId: string) => void;
  sections: FilterSection[];
  className?: string;
  title?: string;
  activeFilters?: Record<string, any>;
}

export const AdvancedFilterPanel = forwardRef<HTMLDivElement, AdvancedFilterPanelProps>(
  ({
    isOpen,
    onClose,
    presets = [],
    onSavePreset,
    onLoadPreset,
    onDeletePreset,
    sections,
    className,
    title = "Advanced Filters",
    activeFilters = {},
  }, ref) => {
    const [savePresetName, setSavePresetName] = useState("");
    const [showSavePreset, setShowSavePreset] = useState(false);

    const handleSavePreset = () => {
      if (savePresetName.trim() && onSavePreset) {
        onSavePreset(savePresetName.trim(), activeFilters);
        setSavePresetName("");
        setShowSavePreset(false);
      }
    };

    const getActiveFilterCount = () => {
      return Object.values(activeFilters).filter(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'boolean') return value === true;
        return value != null && value !== '';
      }).length;
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fade-in">
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl animate-slide-in-from-right">
          <Card ref={ref} className={cn("h-full border-0 rounded-none", className)}>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getActiveFilterCount()} active
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Filter Presets */}
              {(presets.length > 0 || onSavePreset) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Filter Presets</h3>
                    {onSavePreset && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSavePreset(!showSavePreset)}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    )}
                  </div>

                  {showSavePreset && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Preset name..."
                        value={savePresetName}
                        onChange={(e) => setSavePresetName(e.target.value)}
                        className="text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                      />
                      <Button size="sm" onClick={handleSavePreset}>
                        Save
                      </Button>
                    </div>
                  )}

                  <div className="grid gap-2">
                    {presets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onLoadPreset?.(preset)}
                            className="p-0 h-auto font-medium text-left justify-start"
                          >
                            {preset.name}
                          </Button>
                          {preset.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Default
                            </Badge>
                          )}
                          {preset.count && (
                            <span className="text-xs text-muted-foreground">
                              ({preset.count})
                            </span>
                          )}
                        </div>
                        {onDeletePreset && !preset.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeletePreset(preset.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />
                </div>
              )}

              {/* Filter Sections */}
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={section.id}>
                    {section.collapsible ? (
                      <Collapsible defaultOpen={section.defaultOpen ?? true}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex w-full justify-between p-0 font-medium text-left"
                          >
                            {section.title}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          {section.children}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <div>
                        <h3 className="font-medium mb-3">{section.title}</h3>
                        {section.children}
                      </div>
                    )}
                    
                    {index < sections.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);

AdvancedFilterPanel.displayName = "AdvancedFilterPanel";