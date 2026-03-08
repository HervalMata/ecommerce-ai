import { type SchemaTypeDefinition } from 'sanity'
import {categoryType} from "@/sanity/schemaTypes/categoryType";
import {productType} from "@/sanity/schemaTypes/productType";
import {orderType} from "@/sanity/schemaTypes/orderType";
import { customerType } from './customerType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, customerType, productType, orderType],
}
