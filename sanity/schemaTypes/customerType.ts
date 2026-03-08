import { defineField, defineType } from "sanity";
import { UserIcon } from "@/sanity/icons";

export const customerType = defineType({
    name: "customer",
    title: "Customer",
    type: "document",
    icon: UserIcon,
    groups: [
        { name: "details", title: "Customer Details", default: true },
        { name: "stripe", title: "Stripe" },
    ],
    fields: [
        defineField({
            name: "email",
            type: "string",
            group: "details",
            validation: (rule) => [rule.required().error("Email é requerido")],
        }),
        defineField({
            name: "name",
            type: "string",
            group: "details",
            description: "Nome do Comprador",
        }),
        defineField({
            name: "clerkUserId",
            type: "string",
            group: "details",
            description: "ID do Usuário Clerk para autenticação",
        }),
        defineField({
            name: "stripeCustomerId",
            type: "string",
            group: "stripe",
            description: "Stripe ID do Usuário para pagamento",
            validation: (rule) => [rule.required().error("Stripe ID do Comprador é requerido")],
        }),
        defineField({
            name: "createdAt",
            type: "datetime",
            group: "details",
            readonly: true,
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            email: "email",
            name: "name",
            stripeCustomerId: "stripeCustomerId",
        },
        prepare({ email, name, stripeCustomerId }) {
            return {
                title: name ?? email ?? "Comprador Desconhecido",
                subtitle: stripeCustomerId
                    ? `${email ?? ""} • ${stripeCustomerId}`
                    : (email ?? "")
            };
        },
    },
    orderings: [
        {
            title: "Mais Novos",
            name: "createdAtDesc",
            by: [{ field: "createdAt", direction: "desc" }]
        },
        {
            title: "Email A-Z",
            name: "emailAsc",
            by: [{ field: "email", direction: "asc" }]
        },
    ],
});