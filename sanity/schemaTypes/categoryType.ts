import {defineField, defineType} from "@sanity/types";
import {TagIcon} from "@sanity/icons";

export const categoryType = defineType({
    name: "category",
    title: "Category",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            type: "string",
            validation: (rule) => [
                rule.required().error("Category title is required"),
            ],
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (rule) => [
                rule.required().error("Category slug is required"),
            ],
        }),
        defineField({
            name: "image",
            type: "image",
            options: {
                hotspot: true,
            },
            description: "Category image is required",
        }),
    ],
    preview: {
        select: {
            title: "title",
            media: "image",
        },
    },
});
