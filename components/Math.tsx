'use client';

import katex from 'katex';
import { useEffect, useRef } from 'react';

interface MathProps {
  math: string;
  block?: boolean;
}

export default function Math({ math, block = false }: MathProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(math, containerRef.current, {
        displayMode: block,
        throwOnError: false,
      });
    }
  }, [math, block]);

  return <span ref={containerRef} className={block ? "my-6 block text-center overflow-x-auto" : ""} />;
}
