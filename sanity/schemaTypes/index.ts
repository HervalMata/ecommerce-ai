import { type SchemaTypeDefinition } from 'sanity'
import {categoryType} from "@/sanity/schemaTypes/categoryType";
import {productType} from "@/sanity/schemaTypes/productType";
import {orderType} from "@/sanity/schemaTypes/orderType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, productType, orderType],
}
