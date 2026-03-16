import { getAllPosts } from '@/lib/posts';
import CategoryFilterClient from '@/components/CategoryFilterClient';

export default function Categories() {
  const posts = getAllPosts();

  return (
    <CategoryFilterClient 
      title="Categories" 
      posts={posts} 
    />
  );
}
