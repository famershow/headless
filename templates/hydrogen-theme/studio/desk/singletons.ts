import {StructureBuilder} from 'sanity/desk'
import {getAllLanguages} from '../../countries'
import {CogIcon, EarthGlobeIcon, HomeIcon, InsertAboveIcon, InsertBelowIcon} from '@sanity/icons'
import {ForwardRefExoticComponent, RefAttributes, SVGProps} from 'react'
import {previewView} from './previewView'

type Singleton = {
  id: string
  _type: string
  title: string
  needsTranslations: boolean
  needsPreview: boolean
  icon?: any
}

const languages = getAllLanguages()

export const SINGLETONS: {
  [key: string]: Singleton
} = {
  home: {
    id: 'home',
    _type: 'home',
    title: 'Home',
    needsTranslations: true,
    needsPreview: true,
    icon: HomeIcon,
  },
  header: {
    id: 'header',
    _type: 'header',
    title: 'Header',
    needsTranslations: true,
    needsPreview: false,
    icon: InsertBelowIcon,
  },
  footer: {
    id: 'footer',
    _type: 'footer',
    title: 'Footer',
    needsTranslations: true,
    needsPreview: false,
    icon: InsertAboveIcon,
  },
  themeContent: {
    id: 'themeContent',
    _type: 'themeContent',
    title: 'Theme Content',
    needsTranslations: true,
    needsPreview: false,
    icon: EarthGlobeIcon,
  },
  typography: {
    id: 'typography',
    _type: 'typography',
    needsTranslations: false,
    needsPreview: false,
    title: 'Typography',
  },
  settings: {
    id: 'settings',
    _type: 'settings',
    title: 'Settings',
    needsTranslations: false,
    needsPreview: false,
    icon: CogIcon,
  },
}

export const singleton = (S: StructureBuilder, singleton: Singleton) =>
  languages.length > 1 && singleton.needsTranslations
    ? S.listItem()
        .title(singleton.title)
        .id(singleton._type)
        .icon(singleton.icon)
        .child(
          S.list()
            .title(singleton.title)
            .id(singleton._type)
            .items(
              languages.map((language) => {
                const docTile = `${singleton.title} (${language.id.toLocaleUpperCase()})`
                return S.documentListItem()
                  .showIcon(false)
                  .schemaType(singleton._type)
                  .id(`${singleton._type}-${language.id}`)
                  .title(docTile)
                  .child(
                    S.document()
                      .title(docTile)
                      .schemaType(singleton._type)
                      .id(`${singleton._type}-${language.id}`)
                      .views(singleton.needsPreview ? previewView(S) : [S.view.form()]),
                  )
              }),
            )
            .canHandleIntent(
              (intentName, params) =>
                intentName === 'edit' && params.id.startsWith(singleton._type),
            ),
        )
    : S.documentTypeListItem(singleton._type)
        .icon(singleton.icon)
        .child(
          S.document()
            .title(singleton.title)
            .schemaType(singleton._type)
            .documentId(singleton._type)
            .views(singleton.needsPreview ? previewView(S) : [S.view.form()]),
        )
