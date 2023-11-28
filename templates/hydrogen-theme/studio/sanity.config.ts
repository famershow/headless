import {defineConfig, isDev} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {fontPicker} from '@headless.build/sanity-font-picker'
import {colorPicker} from '@headless.build/sanity-color-picker'
import {rangeSlider} from '@headless.build/sanity-plugin-range-slider'
import {codeInput} from '@sanity/code-input'
import {presentationTool} from 'sanity/presentation'
import {languageFilter} from '@sanity/language-filter'

import {schemaTypes} from './schemas'
import {defaultDocumentNode, structure} from './desk'
import {projectDetails} from './project.details'
import {getAllLanguages} from '../countries'
import {customDocumentActions} from './plugins/customDocumentActions'

const {projectId, dataset, apiVersion} = projectDetails
const localePreviewUrl = 'http://localhost:3000'
const languages = getAllLanguages()
const devOnlyPlugins = [
  visionTool({
    defaultApiVersion: apiVersion,
    defaultDataset: dataset,
  }),
]
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
    customDocumentActions(),
    presentationTool({
      // Required: set the base URL to the preview location in the front end
      previewUrl: `${SANITY_STUDIO_PREVIEW_URL}/sanity/preview`,
    }),
    internationalizedArray({
      languages: getAllLanguages(),
      defaultLanguages: [languages[0].id],
      fieldTypes: ['string', 'text', 'slug', 'headerNavigation'],
      buttonLocations: ['field'],
    }),
    languageFilter({
      supportedLanguages: getAllLanguages(),
      defaultLanguages: [languages[0].id],
      documentTypes: ['page', 'home', 'themeContent', 'header', 'footer', 'product', 'collection'],
    }),
    ...(isDev ? devOnlyPlugins : []),
  ],
  schema: {
    types: schemaTypes,
  },
})
