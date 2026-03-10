import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import FadeIn from '@/components/FadeIn';

export default function Tags() {
  const tags = getAllTags();

  return (
    <div className="space-y-12">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight border-b border-border pb-4">Tags</h1>
      </FadeIn>
      
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-3 mb-12">
          {tags.map(tag => (
            <a key={tag} href={`#${tag}`} className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-border transition-colors">
              #{tag}
            </a>
          ))}
        </div>
      </FadeIn>

      <div className="space-y-16">
        {tags.map((tag, index) => {
          const tagPosts = getPostsByTag(tag);
          return (
            <FadeIn key={tag} delay={0.2 + index * 0.05}>
              <section id={tag} className="scroll-mt-24">
                <h2 className="text-2xl font-medium mb-6">#{tag} <span className="text-muted-foreground text-lg ml-2">({tagPosts.length})</span></h2>
                <ul className="space-y-4">
                  {tagPosts.map(post => (
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
