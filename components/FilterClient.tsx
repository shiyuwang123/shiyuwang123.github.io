'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { PostMeta } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import FadeIn from '@/components/FadeIn';

interface FilterClientProps {
  title: string;
  posts: PostMeta[];
  filters: string[];
  filterType: 'category' | 'tag' | 'year';
  allLabel?: string;
}

function getHashFilter(filters: string[], allLabel: string): string {
  if (typeof window === 'undefined') {
    return allLabel;
  }

  const hash = window.location.hash.replace('#', '');
  if (!hash) {
    return allLabel;
  }

  const decodedHash = decodeURIComponent(hash);
  return filters.includes(decodedHash) ? decodedHash : allLabel;
}

export default function FilterClient({ title, posts, filters, filterType, allLabel = 'All' }: FilterClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>(() => getHashFilter(filters, allLabel));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleHashChange = () => {
      setActiveFilter(getHashFilter(filters, allLabel));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [allLabel, filters]);

  const filteredPosts = activeFilter === allLabel
    ? posts
    : posts.filter(post => {
        if (filterType === 'category') {
          return post.categories.includes(activeFilter);
        } else if (filterType === 'tag') {
          return post.tags.includes(activeFilter);
        } else if (filterType === 'year') {
          const year = post.date.match(/^(\d{4})/)?.[1] || new Date(post.date).getFullYear().toString();
          return year === activeFilter;
        }
        return true;
      });

  return (
    <div className="space-y-12">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight border-b border-border pb-4">{title}</h1>
      </FadeIn>
      
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActiveFilter(allLabel)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === allLabel 
                ? 'bg-foreground text-background' 
                : 'bg-muted hover:bg-border text-foreground'
            }`}
          >
            {allLabel}
          </button>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter 
                  ? 'bg-foreground text-background' 
                  : 'bg-muted hover:bg-border text-foreground'
              }`}
            >
              {filterType === 'tag' ? `#${filter}` : filter}
            </button>
          ))}
        </div>
      </FadeIn>

      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: index * 0.02 } }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="group"
            >
              <Link href={`/posts/${post.slug}`} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <time dateTime={post.date} className="text-sm text-muted-foreground whitespace-nowrap w-32">
                  {formatDate(post.date)}
                </time>
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
        {filteredPosts.length === 0 && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-muted-foreground py-8 text-center"
          >
            No posts found.
          </motion.p>
        )}
      </div>
    </div>
  );
}
