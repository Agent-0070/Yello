import * as React from "react"

import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    const [reveal, setReveal] = React.useState(false)
    const isPassword = type === "password"

    if (!isPassword) {
      return (
        <input
          type={type}
          className={cn(
            "flex md:h-13 h-10 w-full rounded-md border border-border bg-background px-4 py-2 text-[16px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-border focus-visible:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <div className="relative">
        <input
          type={reveal ? "text" : "password"}
          className={cn(
            "flex md:h-13 h-10 w-full min-h-[40px] rounded-md border border-border bg-background px-4 py-2 pr-11 text-[16px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-border focus-visible:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />

        <button
          type="button"
          aria-label={reveal ? "Hide password" : "Show password"}
          onClick={() => setReveal((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded w-9 h-9 bg-transparent text-muted-foreground focus:outline-none focus:ring-0"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {reveal ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.02-2.17 2.63-3.99 4.6-5.24" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
