"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface ActivityCalendarProps {
    sessionDates: Date[];
}

export function ActivityCalendar({ sessionDates }: ActivityCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Convert session dates to date strings for comparison
    // Use local date string to avoid timezone issues with toISOString
    const sessionDateStrings = new Set(
        sessionDates.map(date => {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
    );

    // Custom modifiers for styling
    const modifiers = {
        session: (date: Date) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            return sessionDateStrings.has(dateStr);
        },
    };

    const modifiersClassNames = {
        session: "bg-green-600 text-primary-foreground !rounded font-bold hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    };

    return (
        <div className="space-y-4">
            <Calendar
                mode="single"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="w-full"
            />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-primary" />
                    <span>Workout day</span>
                </div>
            </div>
        </div>
    );
}
