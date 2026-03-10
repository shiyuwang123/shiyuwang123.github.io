'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface PostLayoutProps {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  children: ReactNode;
}

export default function PostLayout({ title, date, categories = [], tags = [], children }: PostLayoutProps) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 leading-tight">{title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <Link key={cat} href={`/categories#${cat}`} className="hover:text-foreground transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {tags.map(tag => (
              <Link key={tag} href={`/tags#${tag}`} className="px-3 py-1 bg-muted rounded-full text-xs font-medium hover:bg-border transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>
      
      <div className="prose">
        {children}
      </div>
      
      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
        <Link href="/" className="text-primary hover:underline font-medium">
          &larr; Back to Home
        </Link>
      </div>
    </motion.article>
  );
}
