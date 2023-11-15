import {getAllLanguages} from '../../countries'
import {StructureBuilder} from 'sanity/desk'

type IntDocument = {
  _type: string
  title: string
  icon?: any
}

const languages = getAllLanguages()

export function intDocumentList(S: StructureBuilder, document: IntDocument) {
  const {title, icon, _type} = document

  if (languages.length === 1) {
    return S.documentTypeListItem(_type).icon(icon)
  }

  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title('Languages')
        .showIcons(false)
        .items([
          S.listItem().title('All').child(S.documentTypeList(_type).title('All languages')),
          ...languages.map((lang) =>
            S.listItem()
              .title(lang.title)
              .child(() =>
                S.documentTypeList(_type)
                  .title(lang.title)
                  .filter(`_type == "${_type}" && language == "${lang.id}"`),
              ),
          ),
        ]),
    )
}
