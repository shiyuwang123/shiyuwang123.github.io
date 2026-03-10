import Image from 'next/image';
import FadeIn from '@/components/FadeIn';

export default function About() {
  return (
    <div className="space-y-12 max-w-3xl mx-auto py-12">
      <FadeIn>
        <h1 className="text-5xl font-bold tracking-tighter text-center mb-12">About Me</h1>
      </FadeIn>
      
      <FadeIn delay={0.1}>
        <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-border/50 mb-12">
          <Image 
            src="/assets/flag.webp" 
            alt="My personal flag" 
            width={1200} 
            height={800} 
            className="w-full h-auto object-cover"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="prose prose-lg mx-auto text-center">
          <p className="text-xl leading-relaxed text-muted-foreground">
            Hello! I'm an undergraduate student at Sichuan University. 
            This is my personal blog where I share my thoughts, experiences, and technical insights.
          </p>
          <p className="text-xl leading-relaxed text-muted-foreground mt-6">
            I am passionate about computer science, programming languages, and exploring the intersection of technology and philosophy.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
