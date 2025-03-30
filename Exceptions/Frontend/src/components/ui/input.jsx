import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-14 px-4 text-base text-lightn bg-bg-color-1 shadow-in-shadow tracking-widest font-light placeholder:text-gray-500 font-montserrat rounded-md border-2 border-bg-color-1 focus:border-accent-primary focus:shadow-shadow-1 outline-none transition-all duration-400 ease-linear",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
