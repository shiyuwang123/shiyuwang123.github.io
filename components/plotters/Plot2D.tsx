'use client';

import dynamic from 'next/dynamic';
import { Plot2DProps } from '@/lib/plot/types';

const Plot2DClient = dynamic(() => import('@/components/plotters/Plot2DClient'), {
  ssr: false,
});

export default function Plot2D(props: Plot2DProps) {
  return <Plot2DClient {...props} />;
}
