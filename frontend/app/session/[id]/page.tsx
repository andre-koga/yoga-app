import { createClient } from "@/lib/supabase/server";
import { SessionPlayer } from "@/components/session/SessionPlayer";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

type RoutineStretchWithStretch = {
    id: string;
    duration: number;
    stretch: {
        id: string;
        name: string;
        image_url: string | null;
        instructions: string[];
        benefits: string | null;
        precautions: string | null;
    };
};

type RawRoutineStretch = Omit<RoutineStretchWithStretch, "stretch"> & {
    stretch: RoutineStretchWithStretch["stretch"] | RoutineStretchWithStretch["stretch"][];
};

export default async function SessionPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch routine details
    const { data: routine, error: routineError } = await supabase
        .from("routines")
        .select("name")
        .eq("id", id)
        .single();

    if (routineError || !routine) {
        notFound();
    }

    // Fetch stretches for this routine
    const { data: routineStretches, error: stretchesError } = await supabase
        .from("routine_stretches")
        .select(`
      id,
      duration,
      stretch:stretches(
        id,
        name,
        image_url,
        instructions,
        benefits,
        precautions
      )
    `)
        .eq("routine_id", id)
        .order("order_index", { ascending: true });

    if (stretchesError || !routineStretches || routineStretches.length === 0) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                No stretches found for this routine.
            </div>
        );
    }

    // Transform the data to match the expected type
    const formattedStretches = routineStretches?.map((rs: RawRoutineStretch) => ({
        ...rs,
        stretch: Array.isArray(rs.stretch) ? rs.stretch[0] : rs.stretch,
    })) as RoutineStretchWithStretch[];

    return (
        <div className="h-full">
            <SessionPlayer
                routineId={id}
                routineName={routine.name}
                stretches={formattedStretches}
            />
        </div>
    );
}
