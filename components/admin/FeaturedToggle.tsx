"use client";

import {DocumentHandle, useDocument, useEditDocument} from "@sanity/sdk-react";
import {Skeleton} from "@sanity/ui";
import {Suspense} from "react";
import {Button} from "@/components/ui/button";
import {Star} from "lucide-react";
import {cn} from "@/lib/utils";

interface FeaturedToggleProps extends DocumentHandle {

}

function FeaturedToggleContent(handle: FeaturedToggleProps) {
    const { data: featured } = useDocument({ ...handle, path: "featured" });
    const editFeatured = useEditDocument({ ...handle, path: "featured" });

    const isFeatured = featured as boolean;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editFeatured(!isFeatured)}
            title={isFeatured ? "Remover dos Produtos em Destaque" : "Adicionar pra Produto em Destaque"}
        >
            <Star className={cn(
                "h-4 w-4 transition-colors",
                isFeatured
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-300 dark:text-zinc-600"
            )} />
        </Button>
    );
}

function FeaturedToggleSkeleton() {
    return <Skeleton className="h-8 w-8" />;
}

export function FeaturedToggle(props: FeaturedToggleProps) {
    return (
        <Suspense fallback={<FeaturedToggleSkeleton />}>
            <FeaturedToggleContent {...props} />
        </Suspense>
    );
}
