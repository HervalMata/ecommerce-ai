"use client";

import {DocumentHandle, useClient, useDocument, useEditDocument} from "@sanity/sdk-react";
import {ChangeEvent, Suspense, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp, ImageIcon, Loader2, Upload, X} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";
import {cn} from "@/lib/utils";

interface SanityImagesAsset {
    _type: "image";
    _key: string;
    asset: {
        _type: "reference";
        _ref: string;
    };
}

interface ImageWithUrl {
    _type: string;
    _key: string;
    asset: {
        _type: string;
        _ref: string;
    } | null;
}

function ImageUploaderContent(handle: DocumentHandle) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const client = useClient({ apiVersion: "2024-01-01" });
    const { data: images } = useDocument({ ...handle, path: "images" });
    const editImages = useEditDocument({ ...handle, path: "images" });

    const currentImages = (images as ImageWithUrl[] | null) ?? [];

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(`Carregando ${files.length} imagens...`);

        try {
            const newImages: SanityImagesAsset[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadProgress(`Carregando ${i + 1} de ${files.length} imagens...`);

                const asset = await client.assets.upload("image", file, {
                    filename: file.name,
                });

                newImages.push({
                    _type: "image",
                    _key: crypto.randomUUID(),
                    asset: {
                        _type: "reference",
                        _ref: asset._id,
                    },
                });
            }

            const updatedImages = [ ...currentImages, ...newImages ];
            editImages(updatedImages);
            setUploadProgress(null);
        } catch (error) {
            console.error("Falha ao carregar as imagens", error);
            setUploadProgress("Falha ao Carregar. Por favor tente novamente");
            setTimeout(() => setUploadProgress(null), 3000);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = (keyToRemove: string) => {
        const updatedImages = currentImages.filter(
            (img) => img._key === keyToRemove,
        );
        editImages(updatedImages.length > 0 ? updatedImages : null);
    };

    const handleMoveImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= currentImages.length) return;

        const updatedImages = [...currentImages];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        editImages(updatedImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex items-center gap-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {uploadProgress}
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Carregando Imagens
                        </>
                    )}
                </Button>
            </div>

            {/* Image Grid */}
            {currentImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {currentImages.map((image, index) => (
                        <ImageThumbnail
                            key={image._key}
                            image={image}
                            index={index}
                            isFirst={index === 0}
                            onRemove={() => handleRemoveImage(image._key)}
                            onMoveUp={() => handleMoveImage(index, index -1)}
                            onMoveDown={() => handleMoveImage(index, index + 1)}
                            canMoveUp={index > 0}
                            canMoveDown={index < currentImages.length - 1}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed
                                border-zinc-200 py-8 dark:border-zinc-700">
                    <ImageIcon className="mb-2 h-10 w-10 text-zinc-400" />
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Nenhuma imagem carregada
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Click em Upload para adicionar imagens do produto
                    </p>
                </div>
            )}

            {currentImages.length > 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Primeira imagem será a principal imagem do produto.
                </p>
            )}
        </div>
    );
}

interface ImageThumbnailProps {
    image: ImageWithUrl;
    index: number;
    isFirst: boolean;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

function ImageThumbnail(
    {
        image,
        index,
        isFirst,
        onRemove,
        onMoveUp,
        onMoveDown,
        canMoveUp,
        canMoveDown,
    }: ImageThumbnailProps,
) {
    const assetRef = image.asset?._ref;
    let imageUrl: string | null = null;

    if (assetRef) {
        const match = assetRef.match(/^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/);
        if (match) {
            const [, id, dimensions, format] = match;
            imageUrl =
                `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                /${process.env.NEST_PUBLIC_SANITY_DATASET}/${id}-${dimensions}.${format}`;
        }
    }

    return (
        <div className={cn(
            "group relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800",
            isFirst && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900",
        )}>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Imagem do produto"
                    fill
                    className="object-cover"
                    sizes="150px"
                />
            ) : (
                <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-zinc-400" />
                </div>
            )}

            {/* First image badge */}
            {isFirst && (
                <div className="absolute left-2 top-2 rounded bg-blue-500 px-1.5 py-0.5 text-xs font-medium text-white">
                    Principal
                </div>
            )}

            {/* Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50
                            opacity-0 transition-opacity group-hover:opacity-100">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={onMoveUp}
                        disabled={!canMoveUp}
                    >
                        <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={onMoveDown}
                        disabled={!canMoveDown}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>

                {/* Delete Button */}
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onRemove}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

function ImageUploaderSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <div>
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
            </div>
        </div>
    );
}

export function ImageUploader(props: DocumentHandle) {
    return (
        <Suspense fallback={<ImageUploaderSkeleton />}>
            <ImageUploaderContent {...props} />
        </Suspense>
    )
}
