import { type SchemaTypeDefinition } from 'sanity'
import {categoryType} from "./categoryType";
import {productType} from "./productType";
import {orderType} from "./orderType";
import { customerType } from './customerType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, customerType, productType, orderType],
}
