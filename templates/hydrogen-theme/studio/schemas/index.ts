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

const singletons = [home, header, footer, settings, themeContent]
const documents = [page, color, collection, product, blogPost]
const sections = [heroSection, ctaSection]
const objects = [sectionsList, seo, sectionSettings]

export const schemaTypes = [...singletons, ...documents, ...sections, ...objects]
