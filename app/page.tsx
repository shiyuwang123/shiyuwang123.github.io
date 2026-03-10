import Link from 'next/link';
import Image from 'next/image';
import { getHighlightedPosts } from '@/lib/posts';
import FadeIn from '@/components/FadeIn';

export default function Home() {
  const highlights = getHighlightedPosts();

  return (
    <div className="space-y-24 pb-12">
      <section className="text-center space-y-8 py-20 flex flex-col items-center">
        <FadeIn>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">My Blog</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Sharing my thoughts, experiences, and technical insights.
          </p>
        </FadeIn>
        <FadeIn delay={0.2} className="w-full">
          <div className="w-full max-w-4xl mx-auto mt-12 rounded-[2rem] overflow-hidden shadow-2xl border border-border/50">
            <Image 
              src="/assets/flag.webp" 
              alt="My personal flag" 
              width={1200} 
              height={800} 
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </FadeIn>
      </section>

      <section className="max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-12 tracking-tight text-center">Highlights</h2>
        </FadeIn>
        <div className="grid gap-12">
          {highlights.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.1}>
              <article className="group flex flex-col space-y-4">
                <Link href={`/posts/${post.slug}`} className="block space-y-3">
                  <h3 className="text-2xl md:text-3xl font-semibold group-hover:text-primary transition-colors tracking-tight">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-base text-muted-foreground font-medium">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    {post.categories.length > 0 && (
                      <span>&middot; {post.categories.join(', ')}</span>
                    )}
                  </div>
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.3}>
          <div className="mt-16 text-center">
            <Link href="/archive" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-background bg-foreground rounded-full hover:scale-105 transition-transform">
              View all posts
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
