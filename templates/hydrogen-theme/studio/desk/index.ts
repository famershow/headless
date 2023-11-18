import {DefaultDocumentNodeResolver, StructureResolver} from 'sanity/desk'
import {ComposeIcon} from '@sanity/icons'

import {SINGLETONS, singleton} from './singletons'
import {intDocumentList} from './intDocumentList'
import {IconPage} from '../icons/Page'
import {IconTag} from '../icons/Tag'
import {IconCollectionTag} from '../icons/CollectionTag'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => {
  return S.document().views([S.view.form()])
}

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
