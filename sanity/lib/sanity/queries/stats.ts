import {defineQuery} from "groq";

export const PRODUCT_COUNT_QUERY = defineQuery(`count(*[_type == "product"])`);

export const ORDER_COUNT_QUERY = defineQuery(`count(*[_type == "order"])`);

export const TOTAL_REVENUE_QUERY = defineQuery(`math::sum(*[
    _type == "order",
    && status in ["paid", "shipped", "delivered"]
].total)`);
