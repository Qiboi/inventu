"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function DatePicker({ value, onChange }: { value?: string; onChange: (date: string) => void }) {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd") : "Pilih tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              const formattedDate = format(selectedDate, "yyyy-MM-dd");
                onChange(formattedDate);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
