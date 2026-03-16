'use client';

import dynamic from 'next/dynamic';
import { Plot3DProps } from '@/lib/plot/types';

const Plot3DClient = dynamic(() => import('@/components/plotters/Plot3DClient'), {
  ssr: false,
});

export default function Plot3D(props: Plot3DProps) {
  return <Plot3DClient {...props} />;
}
