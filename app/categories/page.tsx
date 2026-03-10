import Link from 'next/link';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import FadeIn from '@/components/FadeIn';

export default function Categories() {
  const categories = getAllCategories();

  return (
    <div className="space-y-12">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight border-b border-border pb-4">Categories</h1>
      </FadeIn>
      
      <div className="space-y-16">
        {categories.map((category, index) => {
          const catPosts = getPostsByCategory(category);
          return (
            <FadeIn key={category} delay={index * 0.1}>
              <section id={category} className="scroll-mt-24">
                <h2 className="text-2xl font-medium mb-6">{category} <span className="text-muted-foreground text-lg ml-2">({catPosts.length})</span></h2>
                <ul className="space-y-4">
                  {catPosts.map(post => (
                    <li key={post.slug}>
                      <Link href={`/posts/${post.slug}`} className="text-lg hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
