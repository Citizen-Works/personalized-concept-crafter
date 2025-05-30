
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        primary:
          "border-primary/50 bg-primary/10 text-primary dark:border-primary [&>svg]:text-primary",
        secondary:
          "border-secondary/50 bg-secondary/10 text-secondary-foreground dark:border-secondary [&>svg]:text-secondary",
        accent:
          "border-accent/50 bg-accent/10 text-accent dark:border-accent [&>svg]:text-accent",
        teal:
          "border-teal/50 bg-teal/10 text-teal dark:border-teal [&>svg]:text-teal",
        success:
          "border-teal/50 bg-teal/10 text-teal dark:border-teal [&>svg]:text-teal",
        warning:
          "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 dark:border-yellow-400 [&>svg]:text-yellow-500",
        info:
          "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400 dark:border-blue-400 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
