import {defineQuery} from "groq";

const PRODUCT_LIST_PROJECTION = `{
    _id,
    name,
    "slug": slug.current,
    price,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`

export const ALL_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
]   | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    "images": images[]{
          _key,
          asset->{
               _id,
               url
          },
          hotspot
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    dimensions,
    stock,
    featured,
    assemblyRequired,
}`);

export const FEATURED_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
    && featured == true
    && stock > 0
]   | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    stock,
}`);

export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`*[
    _type == "product"
    && category->slug.current == $categorySlug
]   | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`*[
    _type == "product"
    && slug.current == $slug
]   | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    "images": images[]{
          _key,
          asset->{
               _id,
               url
          },
          hotspot
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    dimensions,
    stock,
    featured,
    assemblyRequired,
}`);

export const SEARCH_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
    && (
        name match $searchQuery + "*"
        || description match $searchQuery + "*"
    )
] | score(
    boost(name match $searchQuery + "*", 3)
    boost(description match $searchQuery + "*", 1)
)  | order(score desc) {
    _id,
    _score,
    name,
    "slug": slug.current,
    price,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const FILTER_PRODUCTS_BY_NAME_QUERY = defineQuery(`*[
    _type == "product"
    && ($categorySlug == "" || $category->slug.current == $categorySlug)
    && ($color == "" || $color == $color)
    && ($material == "" || $material == $material)
    && ($minPrice == 0 || $price >= $minPrice)
    && ($maxPrice == 0 || $price <= $maxPrice)
    && (searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*") 
]   | order(name asc){
    _id,
    name,
    "slug": slug.current,
    price,
    "images": images[0...4]{
          _key,
          asset->{
               _id,
               url
          },
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = defineQuery(`*[
    _type == "product"
    && ($categorySlug == "" | $category->Slug.current == $categorySlug)
    && ($color == "" || $color == $color)
    && ($material == "" || $material == $material)
    && ($minPrice == 0 || $price >= $minPrice)
    && ($maxPrice == 0 || $price <= $maxPrice)
    && (searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*") 
]   | order(price asc){
    _id,
    name,
    "slug": slug.current,
    price,
    "images": images[0...4]{
          _key,
          asset->{
               _id,
               url
          },
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = defineQuery(`*[
    _type == "product"
    && ($categorySlug == "" | $category->Slug.current == $categorySlug)
    && ($color == "" || $color == $color)
    && ($material == "" || $material == $material)
    && ($minPrice == 0 || $price >= $minPrice)
    && ($maxPrice == 0 || $price <= $maxPrice)
    && (searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*") 
]   | order(price desc){
    _id,
    name,
    "slug": slug.current,
    price,
    "images": images[0...4]{
            _key,
          asset->{
               _id,
               url
          },
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const FILTER_PRODUCTS_BY_RELEVANCE_QUERY = defineQuery(`*[
    _type == "product"
    && ($categorySlug == "" | $category->Slug.current == $categorySlug)
    && ($color == "" || $color == $color)
    && ($material == "" || $material == $material)
    && ($minPrice == 0 || $price >= $minPrice)
    && ($maxPrice == 0 || $price <= $maxPrice)
    && (searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*") 
]  | score(
    boost(name match $searchQuery + "*", 3)
    boost(description match $searchQuery + "*", 1)
)  | order(_score desc,name asc){
    _id,
    name,
    "slug": slug.current,
    price,
    "images": images[0...4]{
        _key,
          asset->{
               _id,
               url
          },
    },
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const PRODUCTS_BY_IDS_QUERY = defineQuery(`*[
    _type == "product"
    && _id in &ids
] {
    _id,
    name,
    "slug": slug.current,
    price,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
    stock,
}`);

export const LOW_STOCK_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
    && stock > 0
    && stock <= 5
]   | order(stock asc) {
    _id,
    name,
    "slug": slug.current,
    stock,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
}`);

export const OUT_OF_STOCK_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
    && stock == 0
]   | order(stock asc) {
    _id,
    name,
    "slug": slug.current,
    "image": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    },
}`);
