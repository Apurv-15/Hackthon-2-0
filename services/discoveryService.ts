import { Paper, Book, ResourceType, UnifiedResult, Author } from '../types';

// Utility to debounce function calls
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: any;
  return function(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const OPENALEX_API = 'https://api.openalex.org/works';
const OPENLIBRARY_API = 'https://openlibrary.org/search.json';

async function fetchPapers(query: string): Promise<Paper[]> {
  try {
    const response = await fetch(`${OPENALEX_API}?search=${encodeURIComponent(query)}&filter=publication_year:2010-2025&sort=cited_by_count:desc&per-page=12`);
    if (!response.ok) throw new Error('OpenAlex API Error');
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.id,
      type: ResourceType.Paper,
      title: item.title,
      authors: item.authorships?.map((a: any) => ({ name: a.author.display_name, id: a.author.id })) || [],
      year: item.publication_year,
      abstract: item.abstract_inverted_index ? reconstructAbstract(item.abstract_inverted_index) : undefined,
      citationCount: item.cited_by_count,
      isOpenAccess: item.open_access?.is_oa || false,
      journal: item.primary_location?.source?.display_name,
      topics: item.topics?.slice(0, 3).map((t: any) => t.display_name) || [],
      pdfUrl: item.open_access?.oa_url,
      doi: item.doi
    }));
  } catch (error) {
    console.error("Error fetching papers:", error);
    return [];
  }
}

// Helper to reconstruct abstract from inverted index (OpenAlex specific)
function reconstructAbstract(invertedIndex: Record<string, number[]>): string {
  const words: string[] = [];
  Object.entries(invertedIndex).forEach(([word, positions]) => {
    positions.forEach(pos => {
      words[pos] = word;
    });
  });
  return words.join(' ').slice(0, 200) + '...';
}

async function fetchBooks(query: string, limit: number = 10): Promise<Book[]> {
  try {
    const response = await fetch(`${OPENLIBRARY_API}?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error('OpenLibrary API Error');
    const data = await response.json();

    return data.docs.map((item: any) => ({
      id: item.key,
      type: ResourceType.Book,
      title: item.title,
      authors: item.author_name?.map((name: string) => ({ name })) || [],
      year: item.first_publish_year,
      publisher: item.publisher?.[0],
      editionCount: item.edition_count,
      coverId: item.cover_i,
      subjects: item.subject?.slice(0, 3) || [],
      rating: item.ratings_average ? Math.round(item.ratings_average * 10) / 10 : undefined
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// Fetch featured/popular books for homepage
export async function fetchFeaturedBooks(): Promise<Book[]> {
  try {
    // Fetch popular subjects for variety
    const subjects = ['science', 'technology', 'history', 'philosophy', 'mathematics', 'physics'];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    const response = await fetch(`${OPENLIBRARY_API}?q=subject:${randomSubject}&limit=24&sort=editions`);
    if (!response.ok) throw new Error('OpenLibrary API Error');
    const data = await response.json();

    return data.docs.map((item: any) => ({
      id: item.key,
      type: ResourceType.Book,
      title: item.title,
      authors: item.author_name?.map((name: string) => ({ name })) || [],
      year: item.first_publish_year,
      publisher: item.publisher?.[0],
      editionCount: item.edition_count || 1,
      coverId: item.cover_i,
      subjects: item.subject?.slice(0, 3) || [],
      rating: item.ratings_average ? Math.round(item.ratings_average * 10) / 10 : undefined
    }));
  } catch (error) {
    console.error("Error fetching featured books:", error);
    return [];
  }
}

export async function searchResources(query: string): Promise<UnifiedResult[]> {
  const [papers, books] = await Promise.all([
    fetchPapers(query),
    fetchBooks(query)
  ]);

  // Ranking & Interleaving
  // We want to mix books and papers but prioritize high quality ones.
  // Normalized score logic (simplified)
  
  const scoredPapers = papers.map(p => ({
    ...p,
    score: (p.citationCount * 0.5) + (p.year > 2020 ? 50 : 0) // Bias towards citations and recency
  }));

  const scoredBooks = books.map(b => ({
    ...b,
    score: (b.editionCount * 10) + (b.year > 2000 ? 20 : 0) // Bias towards popularity
  }));

  // Simple interleave based on score is tough because scales differ.
  // Let's just alternate or sort by a normalized relevancy if we had one.
  // For this demo, we will combine and sort slightly by "freshness" and general impact proxy.
  
  const allResults: UnifiedResult[] = [...scoredPapers, ...scoredBooks];
  
  // Custom sort: Usually exact text match is best, but here we just shuffle politely 
  // to ensure user sees both types if available.
  // Let's group: Top 2 papers, Top 1 Book, then mix.
  
  const sortedPapers = scoredPapers.sort((a, b) => b.citationCount - a.citationCount);
  const sortedBooks = scoredBooks.sort((a, b) => b.editionCount - a.editionCount);
  
  const mixed: UnifiedResult[] = [];
  let pIdx = 0, bIdx = 0;
  
  while(pIdx < sortedPapers.length || bIdx < sortedBooks.length) {
    if (pIdx < sortedPapers.length) mixed.push(sortedPapers[pIdx++]);
    if (pIdx < sortedPapers.length) mixed.push(sortedPapers[pIdx++]); // 2 papers
    if (bIdx < sortedBooks.length) mixed.push(sortedBooks[bIdx++]); // 1 book
  }
  
  return mixed;
}

export function generateTopicData(results: UnifiedResult[]): { nodes: any[], links: any[] } {
  // Generate a mock graph based on result topics/subjects
  const nodes = new Map<string, { id: string, group: number, val: number }>();
  const links: { source: string, target: string }[] = [];

  results.forEach((r) => {
    let tags: string[] = [];
    if (r.type === ResourceType.Paper) tags = (r as Paper).topics;
    if (r.type === ResourceType.Book) tags = (r as Book).subjects;
    
    // Normalize tags
    tags = tags.slice(0, 4);

    tags.forEach(tag => {
      if (!nodes.has(tag)) {
        nodes.set(tag, { id: tag, group: 1, val: 5 });
      } else {
        const n = nodes.get(tag)!;
        n.val += 2;
      }
    });

    // Link tags within the same resource
    for(let i=0; i<tags.length; i++) {
      for(let j=i+1; j<tags.length; j++) {
        links.push({ source: tags[i], target: tags[j] });
      }
    }
  });

  return {
    nodes: Array.from(nodes.values()),
    links: links.slice(0, 50) // Limit links for performance
  };
}
