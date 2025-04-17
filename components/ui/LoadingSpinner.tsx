import { cn } from "@/utils/classNames"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("border-primary/30 border-t-primary rounded-full animate-spin", sizeClasses[size], "mb-3")} />
      {text && <p className="text-secondary-foreground text-sm">{text}</p>}
    </div>
  )
}
