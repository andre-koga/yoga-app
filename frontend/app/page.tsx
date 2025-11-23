import { createClient } from "@/lib/supabase/server";
import { RoutineCard } from "@/components/routine/RoutineCard";
import { StretchCard } from "@/components/stretch/StretchCard";
import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/database.types";
import Link from "next/link";
import { ArrowRight, Flame, Trophy, Calendar } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  let presetRoutines: Tables<"routines">[] = [];
  let stretches: Tables<"stretches">[] = [];

  try {
    // Fetch preset routines
    const routinesResult = await supabase
      .from("routines")
      .select("*")
      .eq("is_preset", true)
      .limit(4);

    if (routinesResult.error) {
      console.error("Error fetching routines:", routinesResult.error);
    } else {
      presetRoutines = routinesResult.data || [];
    }

    // Fetch recent stretches
    const stretchesResult = await supabase
      .from("stretches")
      .select("*")
      .limit(4);

    if (stretchesResult.error) {
      console.error("Error fetching stretches:", stretchesResult.error);
    } else {
      stretches = stretchesResult.data || [];
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }

  // Fetch user stats
  let stats = { totalSessions: 0, totalMinutes: 0, streak: 0 };

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { getUserStats } = await import("@/app/actions/sessions");
      stats = await getUserStats(user.id);
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back! 👋</h1>
        <p className="text-muted-foreground">
          Ready to move your body? Let&apos;s get stretching.
        </p>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-3 gap-4">
        <Link href="/activity" className="block">
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-muted/50 cursor-pointer">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20">
              <Flame className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </Link>
        <Link href="/activity" className="block">
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-muted/50 cursor-pointer">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <Trophy className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
        </Link>
        <Link href="/activity" className="block">
          <div className="rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-muted/50 cursor-pointer">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold">{stats.totalMinutes}m</div>
            <div className="text-xs text-muted-foreground">Time Spent</div>
          </div>
        </Link>
      </section>

      {/* Featured Routines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Start a Routine</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/routines">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {presetRoutines?.map((routine) => (
            <Link key={routine.id} href={`/routines/${routine.id}`}>
              <RoutineCard
                name={routine.name}
                description={routine.description}
                difficulty={routine.difficulty || "beginner"}
                duration={routine.total_duration || 0}
                isPreset={routine.is_preset || false}
              />
            </Link>
          ))}
          {(!presetRoutines || presetRoutines.length === 0) && (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No routines found.
            </div>
          )}
        </div>
      </section>

      {/* Explore Stretches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Explore Stretches</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/explore">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stretches?.map((stretch) => (
            <Link key={stretch.id} href={`/stretches/${stretch.id}`}>
              <StretchCard
                name={stretch.name}
                difficulty={stretch.difficulty}
                duration={stretch.default_duration}
                imageUrl={stretch.image_url || undefined}
                targetMuscles={stretch.target_muscles}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
