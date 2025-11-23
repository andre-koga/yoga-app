import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Tables } from "@/lib/database.types";

interface PageProps {
    params: Promise<{ id: string }>;
}

type RoutineStretchWithStretch = Tables<"routine_stretches"> & {
    stretch: Tables<"stretches">;
};

export default async function RoutineDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch routine details
    const { data: routine, error: routineError } = await supabase
        .from("routines")
        .select("*")
        .eq("id", id)
        .single();

    if (routineError || !routine) {
        notFound();
    }

    // Fetch stretches for this routine
    const { data: routineStretches } = await supabase
        .from("routine_stretches")
        .select(`
      *,
      stretch:stretches(*)
    `)
        .eq("routine_id", id)
        .order("order_index", { ascending: true });

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
                    <Link href="/">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Link>
                </Button>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {routine.is_preset && (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                Preset
                            </Badge>
                        )}
                        <Badge variant="secondary" className="capitalize">
                            {routine.difficulty}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{routine.name}</h1>
                    {routine.description && (
                        <p className="mt-2 text-muted-foreground">{routine.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(routine.total_duration || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />
                        <span>{routineStretches?.length || 0} stretches</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <Button size="lg" className="w-full" asChild>
                <Link href={`/session/${routine.id}`}>
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Start Session
                </Link>
            </Button>

            {/* Stretches List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Routine Sequence</h2>
                <div className="space-y-3">
                    {routineStretches?.map((item: RoutineStretchWithStretch, index: number) => (
                        <Link
                            key={item.id}
                            href={`/stretches/${item.stretch.id}`}
                            className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                                {index + 1}
                            </div>

                            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                                {item.stretch.image_url ? (
                                    <Image
                                        src={item.stretch.image_url}
                                        alt={item.stretch.name}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{item.stretch.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                    {item.stretch.target_muscles.join(", ")}
                                </p>
                            </div>

                            <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                                {item.duration}s
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
