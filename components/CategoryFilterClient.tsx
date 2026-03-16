'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { PostMeta } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import FadeIn from '@/components/FadeIn';

interface CategoryFilterClientProps {
  title: string;
  posts: PostMeta[];
  allLabel?: string;
}

function getHashCategoryPath(posts: PostMeta[]): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const hash = window.location.hash.replace('#', '');
  if (!hash) {
    return [];
  }

  const decodedHash = decodeURIComponent(hash);
  for (const post of posts) {
    const index = post.categories.indexOf(decodedHash);
    if (index !== -1) {
      return post.categories.slice(0, index + 1);
    }
  }

  return [];
}

export default function CategoryFilterClient({ title, posts, allLabel = 'All' }: CategoryFilterClientProps) {
  const [activePath, setActivePath] = useState<string[]>(() => getHashCategoryPath(posts));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleHashChange = () => {
      setActivePath(getHashCategoryPath(posts));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts]);

  // Build the tree of categories from posts
  // We can determine the available subcategories at each level based on the activePath
  const getSubcategories = (path: string[]) => {
    const subs = new Set<string>();
    posts.forEach(post => {
      // Check if this post matches the current path
      let matches = true;
      for (let i = 0; i < path.length; i++) {
        if (post.categories[i] !== path[i]) {
          matches = false;
          break;
        }
      }
      
      // If it matches and has a subcategory at the next level, add it
      if (matches && post.categories.length > path.length) {
        subs.add(post.categories[path.length]);
      }
    });
    return Array.from(subs).sort();
  };

  // Generate the levels of filters to display
  const filterLevels: { path: string[]; options: string[] }[] = [];

  // Level 0 (Root)
  filterLevels.push({
    path: [],
    options: getSubcategories([])
  });

  // Subsequent levels based on activePath
  for (let i = 0; i < activePath.length; i++) {
    const currentPath = activePath.slice(0, i + 1);
    const options = getSubcategories(currentPath);
    if (options.length > 0) {
      filterLevels.push({
        path: currentPath,
        options
      });
    }
  }

  // Filter posts based on activePath
  const filteredPosts = activePath.length === 0
    ? posts
    : posts.filter(post => {
        for (let i = 0; i < activePath.length; i++) {
          if (post.categories[i] !== activePath[i]) {
            return false;
          }
        }
        return true;
      });

  const handleFilterClick = (levelIndex: number, option: string | null) => {
    if (option === null) {
      // Clicked the "All" button for this level
      // Truncate the path to the level above
      setActivePath(activePath.slice(0, levelIndex));
    } else {
      // Clicked a specific category
      // Replace the path from this level onwards
      const newPath = [...activePath.slice(0, levelIndex), option];
      setActivePath(newPath);
    }
  };

  return (
    <div className="space-y-12">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight border-b border-border pb-4">{title}</h1>
      </FadeIn>
      
      <div className="space-y-4 mb-12">
        {filterLevels.map((level, levelIndex) => {
          const isRoot = levelIndex === 0;
          const currentActiveOption = activePath[levelIndex] || null;
          const levelAllLabel = isRoot ? allLabel : `All ${activePath[levelIndex - 1]}`;

          return (
            <FadeIn key={levelIndex} delay={0.1 + levelIndex * 0.05}>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleFilterClick(levelIndex, null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentActiveOption === null 
                      ? 'bg-foreground text-background' 
                      : 'bg-muted hover:bg-border text-foreground'
                  }`}
                >
                  {levelAllLabel}
                </button>
                {level.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleFilterClick(levelIndex, option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      currentActiveOption === option 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted hover:bg-border text-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </FadeIn>
          );
        })}
      </div>

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
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.categories.length > 0 && (
                    <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-md whitespace-nowrap">
                      {post.categories.join(' / ')}
                    </span>
                  )}
                </div>
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
