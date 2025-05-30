
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        accent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        teal:
          "border-transparent bg-teal text-teal-foreground hover:bg-teal/80",
        success:
          "border-transparent bg-teal-500 text-white hover:bg-teal-500/80",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        unreviewed: 
          "border-transparent bg-dark-100 text-dark-700 hover:bg-dark-100/80",
        approved:
          "border-transparent bg-teal-100 text-teal-700 hover:bg-teal-100/80",
        drafted:
          "border-transparent bg-secondary-100 text-secondary-700 hover:bg-secondary-100/80",
        published:
          "border-transparent bg-primary-100 text-primary-700 hover:bg-primary-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
