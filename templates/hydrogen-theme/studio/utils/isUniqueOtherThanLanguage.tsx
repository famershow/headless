// This checks that there are no other documents
// With this published or draft _id
// Or this schema type

import type {SlugValidationContext} from 'sanity'
import {projectDetails} from '../project.details'

// With the same slug and language
export async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context

  if (!document?.language) {
    return true
  }

  const {apiVersion} = projectDetails
  const client = getClient({apiVersion})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  }

  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`

  const result = await client.fetch(query, params)

  return result
}
