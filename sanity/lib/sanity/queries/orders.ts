import {defineQuery} from "groq";

export const ORDERS_BY_USER_QUERY = defineQuery(`*[
    _type == "order"
    && clerkUserId == $clerkUserId
] | order(createdAt desc) {
    _id,
    orderNumber,
    total,
    status,
    createdAt,
    "itemCount": count(items),
    "itemNames: items[].product->name      
}`);

export const ORDERS_BY_ID_QUERY = defineQuery(`*[
    _type == "order"
    && _id == $id
][0] {
    _id,
    orderNumber,
    email,
    items[]{
        _key,
        quantity,
        priceAtPurchase,
        product->{
            _id,
            name,
            "slug": slug.current,
            "image": images[0]{
                asset->{
                    _id,
                    url
                }
            }
        }
    },
    total,
    status,
    address{
        name,
        line1,
        line2,
        city,
        postcode,
        country,
    },
    stripePaymentId,
    createdAt,
}`);

export const RECENTS_ORDERS_QUERY = defineQuery(`*[
    _type == "order"
] | order(createdAt desc) [0...$limit] {
    _id,
    orderNumber,
    email,
    total,
    status,
    createdAt,   
}`);

export const ORDER_BY_STRIPE_PAYMENT_ID_QUERY = defineQuery(`*[
    _type == "order 
    && stripePaymentId == $stripePaymentId   
][0]{_id}`);
