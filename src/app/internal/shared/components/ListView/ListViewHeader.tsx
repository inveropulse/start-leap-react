import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewHeaderProps } from "@/shared/types/ui/listView.types";

export function ListViewHeader({
  title,
  description,
  onAdd,
  addButtonText,
}: ListViewHeaderProps) {
  const theme = useListViewTheme();

  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        onClick={onAdd}
        className={`flex items-center gap-2 ml-auto ${theme.buttonPrimaryClass}`}
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </Button>
    </div>
  );
}
