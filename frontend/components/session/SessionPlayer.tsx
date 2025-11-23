"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, CheckCircle2, RotateCcw, Home, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { saveSession } from "@/app/actions/sessions";

interface Stretch {
    id: string;
    name: string;
    image_url?: string | null;
    instructions: string[];
    benefits?: string | null;
    precautions?: string | null;
}

interface RoutineStretch {
    id: string;
    duration: number;
    stretch: Stretch;
}

interface SessionPlayerProps {
    routineId: string;
    routineName: string;
    stretches: RoutineStretch[];
}

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export function SessionPlayer({ routineId, routineName, stretches }: SessionPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isInterval, setIsInterval] = useState(true); // Start with an interval
    const [timeLeft, setTimeLeft] = useState(10); // 10s initial interval
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [wasActiveBeforeDialog, setWasActiveBeforeDialog] = useState(false);

    // Session tracking
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

    const currentStretch = stretches[currentIndex];
    const sessionProgress = ((currentIndex) / stretches.length) * 100;

    // Calculate timer progress
    const maxTime = isInterval ? 10 : currentStretch.duration;
    const timerProgress = (timeLeft / maxTime) * 100;

    const handleNext = useCallback(async () => {
        if (isInterval) {
            // Skip interval -> Start Stretch
            setIsInterval(false);
            setTimeLeft(currentStretch.duration);
            setIsActive(true);
        } else {
            // Finish stretch -> Start Next Interval
            if (currentIndex < stretches.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setIsInterval(true);
                setTimeLeft(10); // 10s interval
                setIsActive(true);
            } else {
                // Session complete - save to database
                setIsActive(false);

                if (sessionStartTime) {
                    try {
                        await saveSession({
                            routineId,
                            routineName,
                            startTime: sessionStartTime,
                            endTime: new Date(),
                            duration: totalTimeElapsed,
                            completionPercentage: 100,
                        });
                    } catch (error) {
                        console.error("Failed to save session:", error);
                        // Continue anyway - don't block user
                    }
                }

                setIsCompleted(true);
            }
        }
    }, [isInterval, currentStretch.duration, currentIndex, stretches.length, sessionStartTime, routineId, routineName, totalTimeElapsed]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                if (!isInterval) {
                    setTotalTimeElapsed((prev) => prev + 1);
                }
            }, 1000);
        } else if (timeLeft === 0) {
            if (isInterval) {
                // Interval finished, start stretch
                setIsInterval(false);
                setTimeLeft(currentStretch.duration);
            } else {
                // Stretch finished, go to next interval or finish
                handleNext();
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isInterval, currentStretch, handleNext]);

    // Track session start time
    useEffect(() => {
        if (isActive && !sessionStartTime) {
            setSessionStartTime(new Date());
        }
    }, [isActive, sessionStartTime]);

    const handlePrevious = () => {
        const currentDuration = currentStretch.duration;

        if (isInterval) {
            // If in interval, go back to previous stretch (skip interval)
            if (currentIndex > 0) {
                setCurrentIndex((prev) => prev - 1);
                setIsInterval(false);
                setTimeLeft(stretches[currentIndex - 1].duration);
                setIsActive(false);
            }
            return;
        }

        // If timer has started (time left is less than duration), just reset the timer
        if (timeLeft < currentDuration) {
            setTimeLeft(currentDuration);
            setIsActive(false);
            return;
        }

        // If timer is already at start of stretch, go to previous stretch (skip interval)
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setIsInterval(false);
            setTimeLeft(stretches[currentIndex - 1].duration);
            setIsActive(false);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const handleOpenDialog = () => {
        setWasActiveBeforeDialog(isActive);
        setIsActive(false);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open && wasActiveBeforeDialog) {
            setIsActive(true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (isCompleted) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 text-center">
                <div className="rounded-full bg-green-100 p-6 text-green-600 dark:bg-green-900/20">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Session Complete!</h1>
                    <p className="text-muted-foreground">
                        You completed {routineName} in {formatTime(totalTimeElapsed)}.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Repeat
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Session Progress Bar */}
            <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stretch {currentIndex + 1} of {stretches.length}</span>
                    <span>{Math.round(sessionProgress)}%</span>
                </div>
                <Progress value={sessionProgress} className="h-2" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <button
                    onClick={handleOpenDialog}
                    className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl bg-muted shadow-lg transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    {currentStretch.stretch.image_url ? (
                        <Image
                            src={currentStretch.stretch.image_url}
                            alt={currentStretch.stretch.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </button>

                <div className="text-center space-y-4 w-full max-w-xs mx-auto">
                    <button
                        onClick={handleOpenDialog}
                        className="text-2xl font-bold hover:underline decoration-primary underline-offset-4 focus:outline-none"
                    >
                        {isInterval ? "Get Ready" : currentStretch.stretch.name}
                    </button>

                    <div className="space-y-2">
                        <div className={cn(
                            "text-6xl font-mono font-bold tracking-tighter tabular-nums",
                            isInterval ? "text-muted-foreground" : "text-foreground"
                        )}>
                            {formatTime(timeLeft)}
                        </div>
                        {/* Timer Progress Bar */}
                        <Progress value={timerProgress} className="h-2 w-full" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0 && timeLeft === (isInterval ? 10 : currentStretch.duration)}
                >
                    <RotateCcw className="h-5 w-5" />
                </Button>

                <Button
                    size="icon"
                    className="h-16 w-16 rounded-full"
                    onClick={toggleTimer}
                >
                    {isActive ? (
                        <Pause className="h-8 w-8 fill-current" />
                    ) : (
                        <Play className="h-8 w-8 fill-current ml-1" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={handleNext}
                >
                    <SkipForward className="h-5 w-5" />
                </Button>
            </div>

            {/* Stretch Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{currentStretch.stretch.name}</DialogTitle>
                        <DialogDescription>
                            Detailed instructions and benefits.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            {currentStretch.stretch.image_url ? (
                                <Image
                                    src={currentStretch.stretch.image_url}
                                    alt={currentStretch.stretch.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Instructions</h4>
                                <ol className="list-decimal pl-4 space-y-1 text-sm text-muted-foreground">
                                    {currentStretch.stretch.instructions.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            {currentStretch.stretch.benefits && (
                                <div className="space-y-2 rounded-lg border bg-green-50/50 p-4 dark:bg-green-900/10">
                                    <h3 className="flex items-center gap-2 font-medium text-green-700 dark:text-green-400">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Benefits
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{currentStretch.stretch.benefits}</p>
                                </div>
                            )}

                            {currentStretch.stretch.precautions && (
                                <div className="space-y-2 rounded-lg border bg-orange-50/50 p-4 dark:bg-orange-900/10">
                                    <h3 className="flex items-center gap-2 font-medium text-orange-700 dark:text-orange-400">
                                        <AlertCircle className="h-4 w-4" />
                                        Precautions
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{currentStretch.stretch.precautions}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
