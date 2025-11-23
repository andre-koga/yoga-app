import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityCalendar } from "@/components/activity/ActivityCalendar";
import { Flame, Trophy, Calendar as CalendarIcon, Clock } from "lucide-react";
import { getUserStats } from "@/app/actions/sessions";
import { Tables } from "@/lib/database.types";

export default async function ActivityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                Please sign in to view your activity.
            </div>
        );
    }

    // Fetch user stats
    const stats = await getUserStats(user.id);

    // Fetch session history
    const { data: sessions } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

    // Get all session dates for calendar
    const { data: allSessions } = await supabase
        .from("sessions")
        .select("created_at")
        .eq("user_id", user.id);

    const sessionDates = allSessions?.map((s: { created_at: string }) => new Date(s.created_at)) || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <section className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Activity</h1>
                <p className="text-muted-foreground">
                    Track your progress and see your stretching history.
                </p>
            </section>

            {/* Stats Summary */}
            <section className="grid grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.streak}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.streak === 1 ? "day" : "days"} in a row
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <Trophy className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSessions}</div>
                        <p className="text-xs text-muted-foreground">
                            workouts completed
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                        <Clock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMinutes}m</div>
                        <p className="text-xs text-muted-foreground">
                            total stretching time
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Calendar */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Activity Calendar
                    </CardTitle>
                    <CardDescription>
                        Days you&apos;ve completed stretching sessions are marked.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ActivityCalendar sessionDates={sessionDates} />
                </CardContent>
            </Card>

            {/* Session History */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                    <CardDescription>
                        Your latest stretching workouts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sessions && sessions.length > 0 ? (
                        <div className="space-y-4">
                            {sessions.map((session: Tables<"sessions">) => {
                                const date = new Date(session.created_at || new Date().toISOString());
                                const durationMins = Math.floor((session.duration || 0) / 60);
                                const durationSecs = (session.duration || 0) % 60;

                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{session.routine_name}</h4>
                                                {session.completion_percentage === 100 && (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20">
                                                        Completed
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {date.toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {durationMins}:{durationSecs.toString().padStart(2, "0")}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {date.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            No sessions yet. Start your first routine!
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
