import {defineQuery} from "groq";

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
    }
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
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
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
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
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
    }
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
]   | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
    category->{
        _id,
        title,
        "slug": slug.current,
    },
    material,
    color,
    stock,
}`);

export const FILTER_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
    && ($categorySlug == "" | $category->Slug.current == $categorySlug)
    && ($color == "" || $color == $color)
    && ($material == "" || $material == $material)
    && ($minPrice == "" || $price == $minPrice)
    && ($maxPrice == "" || $price == $maxPrice)
]   | order(
    select(
        $sortBy == "price_asc" => price asc,
        $sortBy == "price_desc" => price desc,
        name asc
    )
 ){
    _id,
    name,
    "slug": slug.current,
    price,
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
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
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
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
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
}`);

export const OUT_OF_STOCK_PRODUCTS_QUERY = defineQuery(`*[
    _type == "product"
    && stock == 0
]   | order(stock asc) {
    _id,
    name,
    "slug": slug.current,
    "images": images[0]{
          asset->{
               _id,
               url
          },
          hotspot
    }
}`);
