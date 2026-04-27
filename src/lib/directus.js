import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

const directus = createDirectus('https://api-gthp.1-2-7-8.solutions')
  .with(staticToken('odPOs8HSIMTJ9n-SPdAwitfvP0pHe4mE'))
  .with(rest());

export async function getProjets(categorySlug = null) {
  const filter = categorySlug
    ? { categories: { portfolio_categories_id: { slug: { _eq: categorySlug } } } }
    : {};
  return directus.request(readItems('portfolio_projets', {
    filter: { status: { _eq: 'published' }, image_vignette: { _nnull: true }, ...filter },
    sort: ['-annee', '-ordre'],
    fields: ['*', 'image_vignette.*', 'categories.portfolio_categories_id.*'],
    limit: 100,
  }));
}

export async function getProjet(slug) {
  const items = await directus.request(readItems('portfolio_projets', {
    filter: { slug: { _eq: slug } },
    fields: ['*', 'image_vignette.*', 'images.*', 'categories.portfolio_categories_id.*'],
    limit: 1,
  }));
  return items[0] || null;
}

export async function getCategories() {
  return directus.request(readItems('portfolio_categories', {
    sort: ['nom'],
  }));
}

export function imageUrl(fileId, width = 800) {
  return `https://api-gthp.1-2-7-8.solutions/assets/${fileId}?width=${width}&fit=cover&quality=85&access_token=odPOs8HSIMTJ9n-SPdAwitfvP0pHe4mE`;
}