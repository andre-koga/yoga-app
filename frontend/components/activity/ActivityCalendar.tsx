"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

interface ActivityCalendarProps {
    sessionDates: Date[];
}

export function ActivityCalendar({ sessionDates }: ActivityCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Convert session dates to date strings for comparison
    const sessionDateStrings = new Set(
        sessionDates.map(date => date.toISOString().split('T')[0])
    );

    // Custom modifiers for styling
    const modifiers = {
        session: (date: Date) => {
            const dateStr = date.toISOString().split('T')[0];
            return sessionDateStrings.has(dateStr);
        },
    };

    const modifiersStyles = {
        session: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            fontWeight: 'bold',
        },
    };

    return (
        <div className="space-y-4">
            <Calendar
                mode="single"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border w-full"
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
