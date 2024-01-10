import {DefaultDocumentNodeResolver, StructureResolver} from 'sanity/structure';

import {SINGLETONS, singleton} from './singletons';
import {IconPage} from '../components/icons/Page';
import {IconBlog} from '../components/icons/Blog';
import {products} from './productStructure';
import {collections} from './collectionStructure';

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => {
  return S.document().views([S.view.form()]);
};

export const structure: StructureResolver = (S, context) => {
  return S.list()
    .title('Content')
    .items([
      singleton(S, SINGLETONS.home),
      S.documentTypeListItem('page').icon(IconPage),
      products(S, context),
      collections(S, context),
      S.documentTypeListItem('blogPost').icon(IconBlog),
      S.divider(),
      singleton(S, SINGLETONS.header),
      singleton(S, SINGLETONS.footer),
      S.divider(),
      singleton(S, SINGLETONS.settings),
      S.documentTypeListItem('colorScheme').showIcon(true),
      singleton(S, SINGLETONS.typography),
      singleton(S, SINGLETONS.themeContent),
    ]);
};
