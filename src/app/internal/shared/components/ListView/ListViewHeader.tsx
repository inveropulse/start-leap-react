import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewHeaderProps } from "../../types/listView.types";

export function ListViewHeader({ 
  title, 
  description, 
  onAdd, 
  addButtonText 
}: ListViewHeaderProps) {
  const theme = useListViewTheme();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      <Button 
        onClick={onAdd} 
        className={`flex items-center gap-2 ${theme.buttonPrimaryClass}`}
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </Button>
    </div>
  );
}