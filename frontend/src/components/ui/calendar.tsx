import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  weekStartsOn = 0,
  formatters,
  ...props
}: CalendarProps) {
  // Resolve a locale to use for weekday names. Prefer the provided prop,
  // otherwise fall back to the browser locale or en-US for SSR safety.
  const propLocale = (props as any).locale;
  const resolvedLocale =
    (typeof propLocale === "string" ? propLocale : undefined) ||
    (typeof navigator !== "undefined" ? navigator.language : "en-US");

  const defaultFormatters: any = {
    // Render a short/narrow visual label but expose the full weekday name via
    // title and aria-label for screen readers.
    formatWeekdayName: (date: Date) => {
      const long = date.toLocaleDateString(resolvedLocale, { weekday: "long" });
      const narrow = date.toLocaleDateString(resolvedLocale, { weekday: "narrow" });
      return (
        <abbr title={long} aria-label={long} className="inline-block">
          {narrow}
        </abbr>
      );
    },
  };
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white dark:bg-background text-black rounded", className)}
      weekStartsOn={weekStartsOn}
      formatters={{ ...(defaultFormatters as any), ...(formatters as any) }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 bg-background w-full",
        caption: "flex justify-center pt-1 pb-2 relative items-center bg-background w-full",
        caption_label: "text-sm font-medium text-foreground",
        nav: "flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-100 text-black dark:text-white border-0"
        ),
        nav_button_previous: "absolute left-0 text-black dark:text-white",
        nav_button_next: "absolute right-0 text-black dark:text-white",
        table: "w-full border-collapse bg-background",
        head_row: "grid grid-cols-7 mb-1",
        head_cell:
          "text-muted-foreground rounded-md w-9 h-9 font-normal text-[0.8rem] flex items-center justify-center bg-background",
        row: "grid grid-cols-7 mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative bg-transparent [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-foreground"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={
        {
          IconLeft: () => <ChevronLeft className="h-4 w-4 text-black dark:text-white" />,
          IconRight: () => <ChevronRight className="h-4 w-4 text-black dark:text-white" />,
        } as any
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
