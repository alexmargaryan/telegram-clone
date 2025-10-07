import { cn } from "@/lib/utils";

const Loading = ({
  className,
  size = "md",
  variant = "default",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "inverse";
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const variantClasses =
    variant === "inverse"
      ? "border-primary-foreground border-t-transparent"
      : "border-primary border-t-transparent";

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses,
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
