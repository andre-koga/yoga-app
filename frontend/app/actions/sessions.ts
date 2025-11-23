"use server";

import { createClient } from "@/lib/supabase/server";

interface SaveSessionParams {
    routineId: string;
    routineName: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    completionPercentage: number;
}

export async function saveSession(params: SaveSessionParams) {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("User not authenticated:", authError);
        return { success: false, error: "Not authenticated" };
    }

    // Insert session record
    const { error: insertError } = await supabase
        .from("sessions")
        .insert({
            user_id: user.id,
            routine_id: params.routineId,
            routine_name: params.routineName,
            start_time: params.startTime.toISOString(),
            end_time: params.endTime.toISOString(),
            duration: params.duration,
            completion_percentage: params.completionPercentage,
        });

    if (insertError) {
        console.error("Error saving session:", insertError);
        return { success: false, error: insertError.message };
    }

    return { success: true };
}

export async function getUserStats(userId: string) {
    const supabase = await createClient();

    // Get total sessions count
    const { count: totalSessions } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

    // Get total time spent
    const { data: sessions } = await supabase
        .from("sessions")
        .select("duration")
        .eq("user_id", userId);

    const totalMinutes = Math.floor(
        (sessions?.reduce((sum: number, s: { duration: number | null }) => sum + (s.duration || 0), 0) || 0) / 60
    );

    // Calculate streak
    const { data: recentSessions } = await supabase
        .from("sessions")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    const streak = calculateStreak(recentSessions || []);

    return {
        totalSessions: totalSessions || 0,
        totalMinutes,
        streak,
    };
}

function calculateStreak(sessions: { created_at: string }[]): number {
    if (!sessions || sessions.length === 0) return 0;

    // Group sessions by date (UTC)
    const sessionDates = new Set(
        sessions.map(s => new Date(s.created_at).toISOString().split('T')[0])
    );

    const sortedDates = Array.from(sessionDates).sort().reverse();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Streak must include today or yesterday to be active
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
        return 0;
    }

    let streak = 0;
    let currentDate = sortedDates.includes(today) ? new Date() : new Date(Date.now() - 86400000);

    // Count backwards from most recent session
    for (const dateStr of sortedDates) {
        const expectedDate = new Date(currentDate).toISOString().split('T')[0];

        if (dateStr === expectedDate) {
            streak++;
            currentDate = new Date(currentDate.getTime() - 86400000); // Previous day
        } else {
            break;
        }
    }

    return streak;
}
