import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

export interface FormDateTimeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  step?: number;
  min?: string;
  max?: string;
  className?: string;
}

export function FormDateTimeField<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  loading = false,
  required = false,
  step = 60,
  min,
  max,
  className,
}: FormDateTimeFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="datetime-local"
                step={step}
                min={min}
                max={max}
                disabled={disabled || loading}
                className={`${loading ? "pr-10" : ""} ${className || ""}`}
                {...field}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
