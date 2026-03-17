"use client";

import {
    deleteDocument,
    discardDocument,
    DocumentHandle,
    useApplyDocumentActions,
    useDocument,
    useQuery
} from "@sanity/sdk-react";
import {useRouter} from "next/navigation";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Trash2} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {Suspense} from "react";

interface DeleteButtonProps {
    handle: DocumentHandle;
    redirectTo?: string;
}

function DeleteButtonContent(
    {
        handle,
        redirectTo = "/admin/inventory",
    }: DeleteButtonProps,
) {
    const router = useRouter();
    const apply = useApplyDocumentActions();

    const baseId = handle.documentId.replace("drafts.", "");

    const { data: doc } = useDocument(handle);

    const { data: publishedDoc } = useQuery<{ _id: string } | null>({
        query: `*[_id == $id][0]{ _id }`,
        params: { id: baseId },
        perspective: "published",
    });

    const { data: referencingOrders } = useQuery<{ _id: string }[]>({
        query: `*[_type == "order" && references($id)]{ _id }`,
        params: { id: baseId },
    });

    const isDraft = doc?._id?.startsWith("drafts.");
    const hasPublishedVersion = !!publishedDoc;
    const hasReferences = referencingOrders && referencingOrders.length > 0;

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Você tem certeza que quer remover este item?.Esta ação não pode ser desfeita",
        );
        if (!confirmed) return;

        try {
            if (hasPublishedVersion) {
                const result = await apply(
                    deleteDocument({
                        documentId: baseId,
                        documentType: handle.documentType,
                    }),
                );
                await result.submitted();
            } else if (isDraft) {
                const result = await apply(
                    discardDocument({
                        documentId: baseId,
                        documentType: handle.documentType,
                    }),
                );
                await result.submitted();
            }
            router.push(redirectTo);
        } catch (error) {
            console.error("Falha ao remover", error);
        }
    }

    if (hasReferences) {
        const orderCount = referencingOrders?.length ?? 0;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1.5"
                            asChild
                        >
                            <Link
                                href={`/studio/structure/${handle.documentType}:${baseId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Trash2 className="h-4 w-4" />
                                Remover do Studio
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Este produto é referenciado para {orderCount} orde
                            {orderCount !== 1 ? "ns" : "m"}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={handleDelete}
        >
            <Trash2 className="h-4 w-4" />
            Remover
        </Button>
    )
}

function DeleteButtonSkeleton() {
    return <Skeleton className="h-9 w-20" />
}

export function DeleteButton(props: DeleteButtonProps) {
    return (
        <Suspense fallback={<DeleteButtonSkeleton />}>
            <DeleteButtonContent {...props} />
        </Suspense>
    )
}
