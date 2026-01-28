/**
 * Service for generating and parsing URL slugs
 */

export function generateSlug(id: string, title: string): string {
  // Convert title to URL-friendly slug
  const titleSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
  
  // Limit to 50 characters and add ID for uniqueness
  return `${titleSlug.substring(0, 50)}-${id}`;
}

export function parseSlug(slug: string): { id: string; title: string } | null {
  if (!slug) return null;
  
  // Extract ID from the end (everything after the last hyphen followed by alphanumeric)
  const match = slug.match(/^(.+)-([a-z0-9]+)$/i);
  
  if (!match) return null;
  
  const [, titleSlug, id] = match;
  
  // Convert slug back to title (replace hyphens with spaces)
  const title = titleSlug.replace(/-/g, ' ');
  
  return { id, title };
}
