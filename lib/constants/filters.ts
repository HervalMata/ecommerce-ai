export const COLORS = [
    { value: "blue", label: "Blue" },
    { value: "pink", label: "Pink" },
    { value: "yellow", label: "Yellow" },
    { value: "grey", label: "Grey" },
    { value: "natural", label: "Natural" },
] as const;

export const MATERIALS = [
    { value: "lonita", label: "Lonita" },
    { value: "gorgurao", label: "Gorgurão" },
    { value: "seda", label: "Seda" },
] as const;

export const SORT_OPTIONS = [
    { value: "name", label: "Nome (A-Z)" },
    { value: "price_asc", label: "Preço Menor Para o Maior" },
    { value: "price_desc", label: "Preço Maior Para o Menor" },
    { value: "relevance", label: "Relevância" },
] as const;

export type ColorValue = (typeof COLORS[number]["value"]);
export type MaterialValue = (typeof MATERIALS[number]["value"]);
export type SortValue = (typeof SORT_OPTIONS[number]["value"]);
