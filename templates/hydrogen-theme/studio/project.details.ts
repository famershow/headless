export const projectDetails = {
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  port: process.env.SANITY_STUDIO_PORT || 9999,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2023-10-01',
  previewUrl: process.env.SANITY_STUDIO_PREVIEW_URL,
  previewSecret: process.env.SANITY_STUDIO_PREVIEW_SECRET,
}
