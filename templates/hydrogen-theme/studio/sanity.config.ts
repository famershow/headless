import {defineConfig, defineField} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {fontPicker} from '@headless.build/sanity-font-picker'
import {colorPicker} from '@headless.build/sanity-color-picker'
import {rangeSlider} from '@headless.build/sanity-plugin-range-slider'
import {codeInput} from '@sanity/code-input'

import {schemaTypes} from './schemas'
import {defaultDocumentNode, structure} from './desk'
import {projectDetails} from './project.details'
import {getAllLanguages} from '../countries'

const {projectId, dataset} = projectDetails

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
