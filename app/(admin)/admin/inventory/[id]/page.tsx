"use client";

import Link from "next/link";
import {ArrowLeft, ExternalLink} from "lucide-react";
import {ReactElement, Suspense, use} from "react";
import {DocumentHandle, useDocument, useDocumentProjection, useEditDocument} from "@sanity/sdk-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Skeleton} from "@/components/ui/skeleton";
import {DeleteButton, ImageUploader, PublishButton, RevertButton} from "@/components/admin";
import {Label} from "@/components/ui/label";

const MATERIALS = [
    { value: "lonita", label: "Lonita" },
    { value: "gorgurao", label: "Gorgurão" },
    { value: "seda", label: "Seda" },
];

const COLORS = [
    { value: "blue", label: "Azul" },
    { value: "green", label: "Verde" },
    { value: "pink", label: "Rosa" },
    { value: "yellow", label: "Amarelo" },
    { value: "grey", label: "Cinza" },
    { value: "natural", label: "Natural" },
];

function NameEditor(handle: DocumentHandle) {
    const { data: name } = useDocument({ ...handle, path: "name" });
    const editName = useEditDocument({...handle, path: "name" });

    return (
        <Input
            value={(name as string) ?? ""}
            onChange={(e) => editName(e.target.value)}
            placeholder="Nome do Produto"
        />
    );
}

function SlugEditor(handle: DocumentHandle) {
    const { data: slug } = useDocument({ ...handle, path: "slug" });
    const editSlug = useEditDocument({...handle, path: "slug" });
    const slugValue = (slug as { current?: string })?.current ?? "";

    return (
        <Input
            value={slugValue}
            onChange={(e) => editSlug({ _type: "slug", current: e.target.value })}
            placeholder="Slug do Produto"
        />
    );
}

function DescriptionEditor(handle: DocumentHandle) {
    const { data: description } = useDocument({ ...handle, path: "description" });
    const editDescription = useEditDocument({...handle, path: "description" });

    return (
        <Input
            value={(description as string) ?? ""}
            onChange={(e) => editDescription(e.target.value)}
            placeholder="Descrição do Produto"
        />
    );
}

function PriceEditor(handle: DocumentHandle) {
    const { data: price } = useDocument({ ...handle, path: "price" });
    const editPrice = useEditDocument({...handle, path: "price" });

    return (
        <Input
            type="number"
            step="0.01"
            min={0.01}
            value={(price as number) ?? ""}
            onChange={(e) => editPrice(parseFloat(e.target.value) || 0)}
            placeholder="Preço do Produto"
        />
    );
}

function StockEditor(handle: DocumentHandle) {
    const { data: stock } = useDocument({ ...handle, path: "stock" });
    const editStock = useEditDocument({...handle, path: "stock" });

    return (
        <Input
            type="number"
            step="1"
            min="0"
            value={(stock as number) ?? 0}
            onChange={(e) => editStock(parseInt(e.target.value) || 0)}
            placeholder="Estoque do Produto"
        />
    );
}

function MaterialEditor(handle: DocumentHandle) {
    const { data: material } = useDocument({ ...handle, path: "material" });
    const editMaterial = useEditDocument({...handle, path: "material" });

    return (
        <Select
            value={(material as string) ?? ""}
            onValueChange={(value) => editMaterial(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Selecione o material" />
            </SelectTrigger>
            <SelectContent>
                {MATERIALS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                        {m.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function ColorEditor(handle: DocumentHandle) {
    const { data: color } = useDocument({ ...handle, path: "color" });
    const editColor = useEditDocument({...handle, path: "color" });

    return (
        <Select
            value={(color as string) ?? ""}
            onValueChange={(value) => editColor(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Selecione a cor" />
            </SelectTrigger>
            <SelectContent>
                {COLORS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                        {c.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function DimensionsEditor(handle: DocumentHandle) {
    const { data: dimensions } = useDocument({ ...handle, path: "dimensions" });
    const editDimensions = useEditDocument({...handle, path: "dimensions" });

    return (
        <Input
            value={(dimensions as string) ?? ""}
            onChange={(e) => editDimensions(e.target.value)}
            placeholder="Dimensões do Produto"
        />
    );
}

function FeaturedEditor(handle: DocumentHandle) {
    const { data: featured } = useDocument({ ...handle, path: "featured" });
    const editFeatured = useEditDocument({...handle, path: "featured" });

    return (
        <Switch
            checked={(featured as boolean) ?? false}
            onCheckedChange={(checked: boolean) => editFeatured(checked)}
        />
    );
}

function AssemblyEditor(handle: DocumentHandle) {
    const { data: assemblyRequired } = useDocument({ ...handle, path: "assemblyRequired" });
    const editAssembly = useEditDocument({...handle, path: "assemblyRequired" });

    return (
        <Switch
            checked={(assemblyRequired as boolean) ?? false}
            onCheckedChange={(checked: boolean) => editAssembly(checked)}
        />
    );
}

interface ProductSlugProjection {
    slug: {
        current: string;
    } | null;
}

function ProductStoreLink(handle: DocumentHandle) {
    const { data } = useDocumentProjection<ProductSlugProjection>({
        ...handle,
        projection: `{ slug }`,
    });

    const slug = data?.slug?.current;

    if (!slug) return null;

    return (
        <Link
            href={`/products/${slug}`}
            target="_blank"
            className="flex items-center justify-center gap-1 text-sm text-zinc-600
                        hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
            Vê na loja
            <ExternalLink className="h-3.5 w-3.5" />
        </Link>
    )
}


function ProductDetailSkeleton() {
    return (
        <div className="space-y-6 sm:space-x-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Skeleton className="h-7 w-48 sm:h-8" />
                    <Skeleton className="mt-2 h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-35" />
            </div>
            <div className="grid gap-6 lg:grid-cols-1 lg:gap-8">
                <div className="space-y-6 lg:col-span-2">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-40 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-80 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        </div>
    );
}


function ProductDetailContent({handle}: {handle: DocumentHandle}) {
    const { data: name } = useDocument({ ...handle, path: "name" });

    return (
        <div className="space-y-6 sm:space-x-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        {(name as string) || "Produto Novo"}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Editar detalhes do produto
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DeleteButton handle={handle} />
                    <Suspense fallback={null}>
                        <RevertButton {...handle} />
                    </Suspense>
                    <Suspense fallback={null}>
                        <PublishButton {...handle} />
                    </Suspense>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-1 lg:gap-8">
                {/* Main Form */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Informações Básicas
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <NameEditor {...handle} />
                                </Suspense>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <SlugEditor {...handle} />
                                </Suspense>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <DescriptionEditor {...handle} />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Preço e Estoque
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price">Preço</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <PriceEditor {...handle} />
                                </Suspense>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Estoque</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <StockEditor {...handle} />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Atributos
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="material">Material</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <MaterialEditor {...handle} />
                                </Suspense>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Cor</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <ColorEditor {...handle} />
                                </Suspense>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dimensions">Dimensões</Label>
                                <Suspense fallback={<Skeleton className="h-10" /> }>
                                    <DimensionsEditor {...handle} />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Opções
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                        Produto em Destaque
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Mostrar na página principal a promoções
                                    </p>
                                </div>
                                <Suspense fallback={<Skeleton className="h-6 w-11" /> }>
                                    <FeaturedEditor {...handle} />
                                </Suspense>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                        Assemblies Requeridos
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Comprador necessitará para assembly
                                    </p>
                                </div>
                                <Suspense fallback={<Skeleton className="h-6 w-11" /> }>
                                    <AssemblyEditor {...handle} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Image Uploader */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Imagens do Produto
                        </h2>
                        <ImageUploader {...handle} />
                        <div className="mt-4">
                            <Suspense fallback={<Skeleton className="h-6 w-11" /> }>
                                <ProductStoreLink {...handle} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Studio Link */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Edições Avançadas
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Colocar categorias e outras opções no Sanity Studio
                        </p>
                        <Link
                            href={`/studio/structure/product:${handle.documentId}`}
                            target="_blank"
                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-900
                                        hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                        >
                            Abrir no Studio
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps): ReactElement {
    const { id } = use(params);

    const handle: DocumentHandle = {
        documentId: id,
        documentType: "product",
    }

    return (
        <div className="space-y-4 sm:space-y-8">
            {/* Back Link */}
            <Link
                href="/admin/inventory"
                className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o estoque
            </Link>

            {/* Product Detail */}
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductDetailContent handle={handle} />
            </Suspense>
        </div>
    )
}
