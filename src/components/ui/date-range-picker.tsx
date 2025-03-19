
import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: [Date | undefined, Date | undefined];
  onChange: (value: [Date | undefined, Date | undefined]) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [from, to] = value;
  
  // Format the date range for display
  const formatDateRange = () => {
    if (from && to) {
      return `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`;
    }
    if (from) {
      return `From ${format(from, "MMM d, yyyy")}`;
    }
    if (to) {
      return `Until ${format(to, "MMM d, yyyy")}`;
    }
    return "Select dates";
  };
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal",
              !from && !to && "text-muted-foreground",
              "w-[220px]"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from, to }}
            onSelect={(range) => {
              onChange([range?.from, range?.to]);
            }}
            numberOfMonths={2}
            initialFocus
          />
          <div className="flex items-center justify-between p-3 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onChange([undefined, undefined])}
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={() => document.body.click()} // Close the popover
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
