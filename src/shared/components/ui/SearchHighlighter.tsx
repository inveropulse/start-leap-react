import { forwardRef, Fragment } from "react";
import { cn } from "@/shared/utils/cn";

interface SearchHighlighterProps {
  text: string;
  searchTerm: string;
  className?: string;
  highlightClassName?: string;
  caseSensitive?: boolean;
}

export const SearchHighlighter = forwardRef<HTMLSpanElement, SearchHighlighterProps>(
  ({
    text,
    searchTerm,
    className,
    highlightClassName = "bg-yellow-200 text-yellow-900 px-0.5 rounded",
    caseSensitive = false,
  }, ref) => {
    if (!searchTerm.trim()) {
      return (
        <span ref={ref} className={className}>
          {text}
        </span>
      );
    }

    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, flags);
    const parts = text.split(regex);

    return (
      <span ref={ref} className={className}>
        {parts.map((part, index) => {
          const isMatch = regex.test(part);
          const key = `${index}-${part}`;
          
          return isMatch ? (
            <mark key={key} className={cn("font-medium", highlightClassName)}>
              {part}
            </mark>
          ) : (
            <Fragment key={key}>{part}</Fragment>
          );
        })}
      </span>
    );
  }
);

SearchHighlighter.displayName = "SearchHighlighter";