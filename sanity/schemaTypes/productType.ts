import {defineField, defineType} from "@sanity/types";
import {PackageIcon} from "@sanity/icons";

export const productType = defineType({
    name: "product",
    title:"Product",
    type: "document",
    icon: PackageIcon,
    groups: [
        { name: "details", title: "Details", default: true },
        { name: "media", title: "Media" },
        { name: "inventory", title: "Inventory" },
    ],
    fields: [
        defineField({
            name: "name",
            type: "string",
            group: "details",
            validation: (rule) => [rule.required().error("Product name is required")],
        }),
        defineField({
            name: "slug",
            type: "slug",
            group: "details",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (rule) => [
                rule.required().error("Product slug is required"),
            ],
        }),
        defineField({
            name: "description",
            type: "text",
            group: "details",
            description: "Description of the product",
        }),
        defineField({
            name: "price",
            type: "number",
            group: "details",
            description: "Price in BRL (e.x. 999,99)",
            validation: (rule) => [
                rule.required().error("Product pricee is required"),
                rule.positive().error("Price must be positive number"),
            ],
        }),
        defineField({
            name: "category",
            type: "reference",
            to: [{ type: "category"}],
            group: "details",
            validation: (rule) => [rule.required().error("Product category is required")],
        }),
        defineField({
            name: "material",
            type: "string",
            group: "details",
            options: {
                list: [
                    { title: "Lonita", value: "lonita" },
                    { title: "Gorgurão", value: "gorgurao" },
                    { title: "Seda", value: "seda" },
                ],
                layout: "radio",
            },
        }),
        defineField({
            name: "color",
            type: "string",
            group: "details",
            options: {
                list: [
                    { title: "Blue", value: "blue" },
                    { title: "Pink", value: "pink" },
                    { title: "Yellow", value: "yellow" },
                    { title: "Grey", value: "grey" },
                    { title: "Natural", value: "natural" },
                ],
                layout: "radio",
            },
        }),
        defineField({
            name: "dimensions",
            type: "string",
            group: "details",
            description: 'e.x. "120cm x 80cm"',
        }),
        defineField({
            name: "images",
            type: "array",
            group: "media",
            of: [
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    }
                }
            ],
            validation: (rule) => [rule.min(1).error("At least one image is required")],
        }),
        defineField({
            name: "stock",
            type: "number",
            group: "inventory",
            initialValue: 0,
            description: 'Number of items in stock',
            validation: (rule) => [
                rule.min(0).error("Product stock cannot be negative"),
                rule.integer().error("Product stock must be a whole number"),
            ],
        }),
        defineField({
            name: "featured",
            type: "boolean",
            group: "inventory",
            initialValue: false,
            description: 'Show this product on homepage and promotions',
        }),
        defineField({
            name: "assemblyRequired",
            type: "boolean",
            group: "inventory",
            initialValue: false,
            description: 'Does this product require assembly?',
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "category.title",
            media: "images.0",
            price: "price",
        },
        prepare({ title, subtitle, media, price }) {
            return {
                title,
                subtitle: `${subtitle ? subtitle + " + " : ""} R$ ${price ?? 0}`,
                media,
            };
        },
    },
});
