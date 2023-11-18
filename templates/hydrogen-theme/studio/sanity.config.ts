import {defineConfig, defineField} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {fontPicker} from '@headless.build/sanity-font-picker'
import {colorPicker} from '@headless.build/sanity-color-picker'
import {rangeSlider} from '@headless.build/sanity-plugin-range-slider'
import {codeInput} from '@sanity/code-input'
import {presentationTool} from 'sanity/presentation'

import {schemaTypes} from './schemas'
import {defaultDocumentNode, structure} from './desk'
import {projectDetails} from './project.details'
import {getAllLanguages} from '../countries'

const {projectId, dataset} = projectDetails
const isDev = process.env.NODE_ENV === 'development'
const localePreviewUrl = 'http://localhost:3000'
const SANITY_STUDIO_PREVIEW_URL = isDev
  ? localePreviewUrl
  : projectDetails.previewUrl || localePreviewUrl

export default defineConfig({
  name: 'default',
  title: 'Sanity x Hydrogen',
  projectId,
  dataset,
  plugins: [
    fontPicker(),
    rangeSlider(),
    colorPicker(),
    codeInput(),
    deskTool({structure, defaultDocumentNode}),
    presentationTool({
      // Required: set the base URL to the preview location in the front end
      previewUrl: SANITY_STUDIO_PREVIEW_URL,
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: getAllLanguages(),
      schemaTypes: ['page', 'home', 'themeContent', 'header', 'footer', 'product', 'collection'],
      metadataFields: [defineField({name: 'slug', type: 'slug'})],
    }),
  ],
  schema: {
    types: schemaTypes,
    // Filter out the default template for new "page"  type documents
    templates: (prev) => prev.filter((template) => !['page'].includes(template.id)),
  },
})
