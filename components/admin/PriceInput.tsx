"use client";

import {DocumentHandle, useDocument, useEditDocument} from "@sanity/sdk-react";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {Suspense} from "react";

interface PriceInputProps extends DocumentHandle{

}

function PriceInputContent(handle: PriceInputProps) {
    const { data: price } = useDocument({ ...handle, path: "price" });
    const editPrice = useEditDocument({ ...handle, path: "price" });

    return (
        <div className="flex items-center gap-1">
            <span className="text-sm text-zinc-500">
                R$
            </span>
            <Input
                type="number"
                min={0.01}
                step={0.01}
                value={typeof price === "number" ? price : ""}
                onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return;
                    editPrice(Number.parseFloat(raw));
                }}
                className="h-8 w-24 text-right"

            />
        </div>
    );
}

function PriceInputSkeleton() {
    return <Skeleton className="h-8 w-24" />;
}

export function PriceInput(props: PriceInputProps) {
    return (
        <Suspense fallback={<PriceInputSkeleton />}>
            <PriceInputContent {...props} />
        </Suspense>
    );
}
