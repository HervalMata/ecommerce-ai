"use client";

import {DocumentHandle, publishDocument, useApplyDocumentActions, useDocument} from "@sanity/sdk-react";
import {Suspense, useState} from "react";
import {Button} from "@/components/ui/button";
import {Check, Loader2, Save, Undo2} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface PublishButtonProps extends DocumentHandle {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

export function PublishButtonContent(
    {
        variant = "default",
        size = "default",
        ...handle
    }:PublishButtonProps,
) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [justPublished, setJustPublished] = useState(false);
    const apply = useApplyDocumentActions();

    const { data: document } = useDocument(handle);

    const isDraft = document?._id.startsWith("drafts.");

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const baseId = handle.documentId.replace("drafts.", "");
            await apply(
                publishDocument({
                    documentId: baseId,
                    documentType: handle.documentType,
                }),
            );
            setJustPublished(true);
            setTimeout(() => setJustPublished(false), 2000);
        } catch (error) {
            console.error("Falha ao publicar", error);
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isDraft && !justPublished) {
        return null;
    }

    if (justPublished) {
        return (
            <Button
                variant={variant}
                size={size}
                disabled
                className="min-w-35"
            >
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Publicado!
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            disabled={isPublishing}
            className="min-w-35"
            onClick={handlePublish}
        >
            {isPublishing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Alterações publicadas
                </>
            )}
        </Button>
    );
}

function PublishBottomSkeleton() {
    return <Skeleton className="h-10 w-35" />
}

export function PublishButton(props: PublishButtonProps) {
    return (
        <Suspense fallback={<PublishBottomSkeleton />}>
            <PublishButtonContent {...props} />
        </Suspense>
    );
}

interface RevertButtonProps extends DocumentHandle {
    size?: "default" | "sm" | "lg" | "icon";
}

export function RevertButtonContent(
    {
        size = "default",
        ...handle
    }: RevertButtonProps,
) {
    const [isReverting, setIsReverting] = useState(false);
    const [justReverted, setJustReverted] = useState(false);
    const apply = useApplyDocumentActions();

    const { data: document } = useDocument(handle);

    const isDraft = document?._id.startsWith("drafts.");

    const handleRevert = async () => {
        setIsReverting(true);
        try {
            const baseId = handle.documentId.replace("drafts.", "");
            await apply(
                publishDocument({
                    documentId: baseId,
                    documentType: handle.documentType,
                }),
            );
            setJustReverted(true);
            setTimeout(() => setJustReverted(false), 2000);
        } catch (error) {
            console.error("Falha ao reverter", error);
        } finally {
            setIsReverting(false);
        }
    };

    if (!isDraft && !justReverted) {
        return null;
    }

    if (justReverted) {
        return (
            <Button
                variant="outline"
                size={size}
                disabled
            >
                <Check className="h-4 w-4 text-green-500" />
            </Button>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="destructive"
                    size={size}
                    onClick={handleRevert}
                    disabled={isReverting}
                >
                    {isReverting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Undo2 className="h-4 w-4" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Descartar Alterações!</p>
            </TooltipContent>
        </Tooltip>
    );
}

export function RevertButton(props: RevertButtonProps) {
    return (
        <Suspense fallback={null}>
            <RevertButtonContent {...props} />
        </Suspense>
    );
}
