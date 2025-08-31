import {
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "@/shared/components/ui/form";
import { Loader2 } from "lucide-react";
import { Textarea, TextareaProps } from "../ui/textarea";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FormTextAreaProps<T extends FieldValues>
  extends Omit<TextareaProps, "name" | "control"> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  loading?: boolean;
  required?: boolean;
}

export function FormTextArea<T extends FieldValues>({
  control,
  name,
  label,
  loading = false,
  required = false,
  disabled,
  className,
  ...textareaProps
}: FormTextAreaProps<T>) {
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
              <Textarea
                {...textareaProps}
                {...field}
                disabled={disabled || loading}
                className={`${loading ? "pr-10" : ""} ${className || ""}`}
              />
              {loading && (
                <div className="absolute right-3 top-3">
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
