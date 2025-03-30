import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-2 bg-bg-color-1 border-bg-color-1 px-4 py-5 text-base leading-5 placeholder:text-gray-500 tracking-widest text-lightn font-montserrat shadow-in-shadow focus:border-accent-primary focus:shadow-shadow-1 outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-400 ease-linear",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
