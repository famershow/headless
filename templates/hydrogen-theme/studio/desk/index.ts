import {DefaultDocumentNodeResolver, StructureResolver} from 'sanity/desk'

import {SINGLETONS, singleton} from './singletons'
import {previewView} from './previewView'
import {getAllLanguages} from '../../countries'
import {intDocumentList} from './intDocumentList'
import {IconPage} from '../icons/Page'
import {IconTag} from '../icons/Tag'
import {IconCollectionTag} from '../icons/CollectionTag'
import {ComposeIcon} from '@sanity/icons'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case 'page':
      return S.document().views(previewView(S))
    default:
      return S.document().views([S.view.form()])
  }
}

const languages = getAllLanguages()

export const structure: StructureResolver = (S) => {
  return S.list()
    .title('Content')
    .items([
      singleton(S, SINGLETONS.home),
      intDocumentList(S, {
        title: 'Pages',
        _type: 'page',
        icon: IconPage,
      }),
      intDocumentList(S, {
        title: 'Products',
        _type: 'product',
        icon: IconTag,
      }),
      intDocumentList(S, {
        title: 'Collections',
        _type: 'collection',
        icon: IconCollectionTag,
      }),
      intDocumentList(S, {
        title: 'Blog posts',
        _type: 'blogPost',
        icon: ComposeIcon,
      }),
      S.divider(),
      singleton(S, SINGLETONS.header),
      singleton(S, SINGLETONS.footer),
      S.divider(),
      singleton(S, SINGLETONS.settings),
      S.documentTypeListItem('colorScheme').showIcon(true),
      singleton(S, SINGLETONS.typography),
      singleton(S, SINGLETONS.themeContent),
    ])
}
