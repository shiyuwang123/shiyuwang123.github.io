import fs from 'fs';
import path from 'path';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  isHighlight?: boolean;
}

export function getAllPosts(): PostMeta[] {
  const postsDirectory = path.join(process.cwd(), 'app/posts');
  let slugs: string[] = [];
  try {
    slugs = fs.readdirSync(postsDirectory);
  } catch (e) {
    return [];
  }
  
  const posts: PostMeta[] = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, slug, 'page.tsx');
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Extract title
    const titleMatch = fileContents.match(/title=\{?["'](.*?)["']\}?/);
    const title = titleMatch ? titleMatch[1] : slug;
    
    // Extract date
    const dateMatch = fileContents.match(/date=\{?["'](.*?)["']\}?/);
    const date = dateMatch ? dateMatch[1] : '';
    
    // Extract categories
    const categoriesMatch = fileContents.match(/categories=\{\[(.*?)\]\}/);
    const categories = categoriesMatch 
      ? categoriesMatch[1].split(',').map(c => c.trim().replace(/['"]/g, '')).filter(Boolean)
      : [];
      
    // Extract tags
    const tagsMatch = fileContents.match(/tags=\{\[(.*?)\]\}/);
    const tags = tagsMatch 
      ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean)
      : [];
      
    // Extract isHighlight
    const isHighlightMatch = fileContents.match(/isHighlight=\{?(true|false)\}?/);
    const isHighlight = isHighlightMatch ? isHighlightMatch[1] === 'true' : false;

    return {
      slug,
      title,
      date,
      categories,
      tags,
      isHighlight
    };
  }).filter(Boolean) as PostMeta[];

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getHighlightedPosts() {
  return getAllPosts().filter(post => post.isHighlight);
}

export function getAllCategories() {
  const categories = new Set<string>();
  getAllPosts().forEach(post => post.categories.forEach(cat => categories.add(cat)));
  return Array.from(categories);
}

export function getAllTags() {
  const tags = new Set<string>();
  getAllPosts().forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter(post => post.categories.includes(category));
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter(post => post.tags.includes(tag));
}

export function formatDate(dateString: string) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    return `${months[month]} ${day}, ${year}`;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
