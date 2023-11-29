import color from './documents/color'
import footer from './singletons/footer'
import header from './singletons/header'
import page from './documents/page'
import settings from './singletons/settings'
import themeContent from './singletons/themeContent'
import ctaSection from './objects/sections/ctaSection'
import heroSection from './objects/sections/heroSection'
import home from './singletons/home'
import collection from './documents/collection'
import product from './documents/product'
import blogPost from './documents/blogPost'
import sectionsList from './objects/global/sectionsList'
import seo from './objects/global/seo'
import sectionSettings from './objects/global/sectionSettings'
import headerNavigation from './objects/global/headerNavigation'
import inventory from './objects/shopify/inventory'
import options from './objects/shopify/options'
import placeholderString from './objects/shopify/placeholderString'
import priceRange from './objects/shopify/priceRange'
import proxyString from './objects/shopify/proxyString'
import shopifyProduct from './objects/shopify/shopifyProduct'
import shopifyProductVariant from './objects/shopify/shopifyProductVariant'
import productVariant from './documents/productVariant'
import shopifyCollection from './objects/shopify/shopifyCollection'
import shopifyCollectionRule from './objects/shopify/shopifyCollectionRule'
import paddingObject from './objects/global/padding'

const singletons = [home, header, footer, settings, themeContent]
const documents = [page, color, collection, product, blogPost, productVariant]
const sections = [heroSection, ctaSection]
const objects = [
  sectionsList,
  seo,
  sectionSettings,
  headerNavigation,
  inventory,
  options,
  placeholderString,
  priceRange,
  proxyString,
  shopifyProduct,
  shopifyProductVariant,
  shopifyCollection,
  shopifyCollectionRule,
  paddingObject,
]

export const schemaTypes = [...objects, ...sections, ...singletons, ...documents]
