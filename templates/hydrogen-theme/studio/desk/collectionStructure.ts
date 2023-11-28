import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'
import {IconCollectionTag} from '../components/icons/CollectionTag'

export const collections = defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Collections')
    .schemaType('collection')
    .icon(IconCollectionTag)
    .child(S.documentTypeList('collection'))
)
