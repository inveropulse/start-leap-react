import { Button } from "./button";

interface SkipToContentProps {
  targetId?: string;
  children?: React.ReactNode;
}

export function SkipToContent({ targetId = "main-content", children }: SkipToContentProps) {
  const handleSkip = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      variant="outline"
      className="absolute -top-10 left-4 z-[9999] focus:top-4 transition-[top] duration-200"
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSkip();
        }
      }}
    >
      {children || "Skip to main content"}
    </Button>
  );
}