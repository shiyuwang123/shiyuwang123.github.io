import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import FadeIn from '@/components/FadeIn';

export default function Archive() {
  const posts = getAllPosts();

  return (
    <div className="space-y-12">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight border-b border-border pb-4">Archive</h1>
      </FadeIn>
      
      <div className="space-y-10">
        {posts.map((post, index) => (
          <FadeIn key={post.slug} delay={index * 0.05}>
            <article className="group">
              <Link href={`/posts/${post.slug}`} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <time dateTime={post.date} className="text-sm text-muted-foreground whitespace-nowrap w-32">
                  {formatDate(post.date)}
                </time>
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
