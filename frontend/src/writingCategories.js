export const WRITING_CATEGORIES = [
  {
    slug: 'poems',
    label: 'Poems',
    description: 'Verses written in stolen minutes - short, honest, occasionally rhyming.'
  },
  {
    slug: 'blogs',
    label: 'Blogs',
    description: 'Unfiltered thoughts, late-night realizations, and things worth saying out loud.'
  },
  {
    slug: 'stories-fiction',
    label: 'Stories & Fiction',
    description: 'Worlds and characters built purely out of curiosity and imagination.'
  }
];

export const getCategoryMeta = (slug) => WRITING_CATEGORIES.find((c) => c.slug === slug);