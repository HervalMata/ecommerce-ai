"use client";

import {DocumentHandle, useDocument, useEditDocument} from "@sanity/sdk-react";
import {Skeleton} from "@/components/ui/skeleton";
import {Suspense} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

interface AddressEditorProps extends DocumentHandle {}

function AddressField(
    {
        handle,
        field,
        label,
        placeholder,
    }:{
        handle: DocumentHandle;
        field: string;
        label: string;
        placeholder?: string;
    }
) {
    const path = `address/${field}`;
    const { data: value } = useDocument({ ...handle, path });
    const editField = useEditDocument({ ...handle, path });

    return (
        <div className="space-y-1.5">
            <Label htmlFor={field} className="text-xs text-zinc-500 dark:text-zinc-400">
                {label}
            </Label>
            <Input
                id={field}
                value={(value as string) ?? ""}
                onChange={(e) => editField(e.target.value)}
                placeholder={placeholder}
                className="h-3"
            />
        </div>
    );
}

function AddressEditorContent(handle: DocumentHandle) {
    return (
        <div className="space-y-3">
            <Suspense fallback={<Skeleton className="h-16" />}>
                <AddressField handle={handle} field="name" label="Nome" placeholder="John Doe" />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-16" />}>
                <AddressField handle={handle} field="line1" label="Endereço Linha 1" placeholder="Av. Central, 100" />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-16" />}>
                <AddressField handle={handle} field="line2" label="Endereço Linha 2" placeholder="Casa 11 (opcional)" />
            </Suspense>
            <div className="grid grid-cols-2 gap-3">
                <Suspense fallback={<Skeleton className="h-16" />}>
                    <AddressField handle={handle} field="city" label="Cidade" placeholder="São Paulo" />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-16" />}>
                    <AddressField handle={handle} field="postcode" label="CEP" placeholder="99.999-999" />
                </Suspense>
            </div>
            <Suspense fallback={<Skeleton className="h-16" />}>
                <AddressField handle={handle} field="country" label="País" placeholder="Brasil" />
            </Suspense>
        </div>
    );
}

function AddressEditorSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
            </div>
            <Skeleton className="h-16" />
        </div>
    )
}

export function AddressEditor(props: AddressEditorProps) {
    return (
        <Suspense fallback={<AddressEditorSkeleton />}>
            <AddressEditorContent {...props} />
        </Suspense>
    )
}
