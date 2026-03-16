import {defineArrayMember, defineField, defineType} from "sanity";
import {BasketIcon} from "@sanity/icons";
import {title} from "valibot";

export const orderType = defineType({
    name: "order",
    title: "Order",
    type: "document",
    icon: BasketIcon,
    groups: [
        { name: "details", title: "Order Details", default: true },
        { name: "customer", title: "Customer" },
        { name: "payment", title: "Payment" },
    ],
    fields: [
        defineField({
            name: "orderNumber",
            type: "string",
            group: "details",
            readOnly: true,
            validation: (rule) => [rule.required().error("Order number is required")],
        }),
        defineField({
            name: "items",
            type: "array",
            group: "details",
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "product",
                            type: "reference",
                            to: [{ type: "product" }],
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: "quantity",
                            type: "number",
                            initialValue: 1,
                            validation: (rule) => rule.min(1),
                        }),
                        defineField({
                            name: "priceAtPurchase",
                            type: "number",
                            description: "Price at time of purchase",
                            validation: (rule) => rule.required(),
                        }),
                    ],
                    preview: {
                        select: {
                            title: "product.name",
                            quantity: "quantity",
                            price: "priceAtPurchase",
                            media: "product.images.0",
                        },
                        prepare({ title, quantity, price, media }) {
                            return {
                                title: title ?? "Product",
                                subtitle: `Qty: ${quantity} * R$ ${price}`,
                                media,
                            };
                        },
                    },
                }),

            ],
        }),
        defineField({
            name: "total",
            type: "number",
            group: "details",
            readOnly: true,
            description: "Total order amount in BRL",
        }),
        defineField({
            name: "status",
            type: "string",
            group: "details",
            initialValue: "paid",
            options: {
                list: [
                    { title: "Paid", value: "paid" },
                    { title: "Shipped", value: "shipped" },
                    { title: "Delivered", value: "delivered" },
                    { title: "Cancelled", value: "cancelled" },
                ],
                layout: "radio",
            },
        }),
        defineField({
            name: "clerkUserId",
            type: "string",
            group: "customer",
            readOnly: true,
            description: "Clerk User ID",
        }),
        defineField({
            name: "customer",
            type: "reference",
            to: [{ type: "customer" }],
            group: "customer",
            description: "Customer ID",
        }),
        defineField({
            name: "email",
            type: "string",
            group: "customer",
            readOnly: true,
        }),
        defineField({
            name: "address",
            type: "object",
            group: "customer",
            fields: [
                defineField({
                    name: "name",
                    type: "string",
                    title: "Full Name",
                }),
                defineField({
                    name: "line1",
                    type: "string",
                    title: "Address Line 1",
                }),
                defineField({
                    name: "line2",
                    type: "string",
                    title: "Address Line 2",
                }),
                defineField({
                    name: "city",
                    type: "string",
                }),
                defineField({
                    name: "line1",
                    type: "postCode",
                    title: "PostCode",
                }),
                defineField({
                    name: "country",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "stripePaymentId",
            type: "string",
            group: "payment",
            readOnly: true,
            description: "Stripe Payment Intent ID",
        }),
        defineField({
            name: "createdAt",
            type: "datetime",
            group: "details",
            readOnly: true,
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            orderNumber: "orderNumber",
            email: "email",
            total: "total",
            status: "status",
        },
        prepare({ orderNumber, email, total, status }) {
            return {
                title: `Order ${orderNumber ?? "N/A"}`,
                subtitle: `${email ?? "No Email"} + R$ ${total ?? 0} * ${status ?? "paid"}`,
            };
        },
    },
    orderings: [
        {
            title: "Newest First",
            name: "createdAtDesc",
            by: [{ field: "createdAt", direction: "desc" }],
        },
    ],
});
