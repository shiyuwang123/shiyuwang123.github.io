import { getAllTags, getAllPosts } from '@/lib/posts';
import FilterClient from '@/components/FilterClient';

export default function Tags() {
  const tags = getAllTags();
  const posts = getAllPosts();

  return (
    <FilterClient 
      title="Tags" 
      posts={posts} 
      filters={tags} 
      filterType="tag" 
    />
  );
}
