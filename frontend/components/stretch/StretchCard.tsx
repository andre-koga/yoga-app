import Image from "next/image";
import { Clock } from "lucide-react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StretchCardProps {
    name: string;
    difficulty: string;
    duration: number;
    imageUrl?: string;
    targetMuscles: string[];
}

export function StretchCard({
    name,
    difficulty,
    duration,
    imageUrl,
    targetMuscles,
}: StretchCardProps) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-video w-full bg-muted">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                <Badge
                    variant="secondary"
                    className="absolute right-2 top-2 bg-background/80 backdrop-blur-sm"
                >
                    {difficulty}
                </Badge>
            </div>
            <CardHeader className="p-4 pb-2">
                <h3 className="line-clamp-1 text-lg font-semibold">{name}</h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                    {targetMuscles.join(", ")}
                </p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between p-4 pt-0 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{duration}s</span>
                </div>
            </CardFooter>
        </Card>
    );
}
