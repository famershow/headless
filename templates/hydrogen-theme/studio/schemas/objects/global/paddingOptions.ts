import {defineField} from 'sanity'

export const paddingTop = defineField({
  name: 'paddingTop',
  title: 'Top padding',
  type: 'rangeSlider',
  options: {
    min: 0,
    max: 200,
    suffix: 'px',
  },
  initialValue: 80,
  validation: (Rule: any) => Rule.min(0).max(200),
})

export const paddingBottom = defineField({
  name: 'paddingBottom',
  title: 'Bottom padding',
  type: 'rangeSlider',
  options: {
    min: 0,
    max: 200,
    suffix: 'px',
  },
  initialValue: 80,
  validation: (Rule: any) => Rule.min(0).max(200),
})
