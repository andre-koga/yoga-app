import { Clock, Dumbbell, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoutineCardProps {
    name: string;
    description?: string | null;
    difficulty: string;
    duration: number;
    stretchCount?: number;
    isPreset?: boolean;
}

export function RoutineCard({
    name,
    description,
    difficulty,
    duration,
    stretchCount,
    isPreset,
}: RoutineCardProps) {
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    };

    return (
        <Card className="flex h-full flex-col transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-lg">{name}</CardTitle>
                    {isPreset && (
                        <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-wider">
                            Preset
                        </Badge>
                    )}
                </div>
                {description && (
                    <CardDescription className="line-clamp-2 text-xs">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal">
                        <Dumbbell className="h-3 w-3" />
                        <span className="capitalize">{difficulty}</span>
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(duration)}</span>
                    </Badge>
                    {stretchCount !== undefined && (
                        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal">
                            <Layers className="h-3 w-3" />
                            <span>{stretchCount} stretches</span>
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
