import {EditIcon, EyeOpenIcon} from '@sanity/icons'
import Iframe from 'sanity-plugin-iframe-pane'
import {StructureBuilder} from 'sanity/desk'
import {DEFAULT_LOCALE, getAllLocales} from '../../countries'
import {SanityDocument} from 'sanity'
import {projectDetails} from '../project.details'

interface Document extends SanityDocument {
  slug: {
    current: string
    _type: string
  }
  language: string
}

export const previewView = (S: StructureBuilder) => [
  S.view.form().icon(EditIcon),
  S.view
    .component(Iframe)
    .options({
      url: (doc: Document) => getPreviewUrl(doc),
      reload: {
        button: true,
        revision: true,
      },
    })
    .title('Preview')
    .icon(EyeOpenIcon),
]

function getPreviewUrl(doc: Document) {
  const isDev = process.env.NODE_ENV === 'development'
  const defaultLanguage = DEFAULT_LOCALE.language.toLocaleLowerCase()
  const docLanguage = doc.language
  const country = resolveCountry(docLanguage)
  const isDefaultLanguage = docLanguage === defaultLanguage
  const slug = doc.slug?.current

  let redirectPath

  if (isDefaultLanguage && slug) {
    redirectPath = `/${slug}` // Slug for default language
  } else if (isDefaultLanguage && !slug) {
    redirectPath = '/' // Home slug for default language
  } else if (!isDefaultLanguage && !slug && country) {
    redirectPath = `${country.pathPrefix}` // Home slug for non-default language
  } else if (!isDefaultLanguage && slug && country) {
    redirectPath = `${country.pathPrefix}/${slug}` // Slug for non-default language
  } else {
    redirectPath = '/'
  }

  const previewSecret = projectDetails.previewSecret
  const previewOrigin = isDev ? 'http://localhost:3000' : projectDetails.previewUrl
  const previewUrl = new URL(`${previewOrigin}/api/preview`)
  previewUrl.searchParams.set('slug', redirectPath)
  previewSecret && previewUrl.searchParams.set('secret', previewSecret)

  return previewUrl.href
}

function resolveCountry(language: string) {
  const countries = getAllLocales()
  const country = countries.find(
    (country) => country.language?.toLowerCase() === language?.toLowerCase(),
  )

  return country
}
