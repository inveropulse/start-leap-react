import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input, type InputProps } from "@/shared/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/shared/components/ui/form";

export interface FormTextFieldProps<T extends FieldValues>
  extends Omit<InputProps, "name" | "control"> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  loading?: boolean;
  required?: boolean;
  description?: string;
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  loading = false,
  required = false,
  disabled,
  className,
  description,
  ...inputProps
}: FormTextFieldProps<T>) {
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
                {...inputProps}
                {...field}
                disabled={disabled || loading}
                className={`${loading ? "pr-10" : ""} ${className || ""}`}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
