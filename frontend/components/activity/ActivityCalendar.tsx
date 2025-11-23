"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                    {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                    >
                        Today
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPreviousMonth}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNextMonth}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Calendar
                mode="single"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
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
