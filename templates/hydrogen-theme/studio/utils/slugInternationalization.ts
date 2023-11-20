import {isUniqueOtherThanLanguage} from './isUniqueOtherThanLanguage'

export const slugOptions = {
  source: 'title',
  slugify: (input: string) => {
    const normalizedString = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    // Replace spaces with '-' and remove special characters
    const slug = normalizedString.replace(/[^a-z0-9-]/g, '-')
    // Remove consecutive '-' and trim leading/trailing '-'
    return slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  },
  isUnique: isUniqueOtherThanLanguage,
}
