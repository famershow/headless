import {CogIcon, EarthGlobeIcon, HomeIcon, InsertAboveIcon, InsertBelowIcon} from '@sanity/icons'
import {StructureBuilder} from 'sanity/desk'

type Singleton = {
  id: string
  _type: string
  title: string
  icon?: any
}

export const SINGLETONS: {
  [key: string]: Singleton
} = {
  home: {
    id: 'home',
    _type: 'home',
    title: 'Home',
    icon: HomeIcon,
  },
  header: {
    id: 'header',
    _type: 'header',
    title: 'Header',
    icon: InsertBelowIcon,
  },
  footer: {
    id: 'footer',
    _type: 'footer',
    title: 'Footer',
    icon: InsertAboveIcon,
  },
  themeContent: {
    id: 'themeContent',
    _type: 'themeContent',
    title: 'Theme Content',
    icon: EarthGlobeIcon,
  },
  typography: {
    id: 'typography',
    _type: 'typography',
    title: 'Typography',
  },
  settings: {
    id: 'settings',
    _type: 'settings',
    title: 'Settings',
    icon: CogIcon,
  },
}

export const singleton = (S: StructureBuilder, singleton: Singleton) =>
  S.documentTypeListItem(singleton._type)
    .icon(singleton.icon)
    .child(
      S.document()
        .title(singleton.title)
        .schemaType(singleton._type)
        .documentId(singleton._type)
        .views([S.view.form()]),
    )
