import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
          Axiom Wang
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/archive" className="hover:text-foreground transition-colors">Archive</Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <Link href="/tags" className="hover:text-foreground transition-colors">Tags</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}
