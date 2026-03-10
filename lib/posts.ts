export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  isHighlight?: boolean;
}

export const posts: PostMeta[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2025-06-25 00:00:00 +0800',
    categories: [],
    tags: [],
    isHighlight: true
  },
  {
    slug: 'two-children-debating',
    title: '两小儿辩品优（Two Children Debating the Quality of Products）',
    date: '2025-06-26 23:43:54 +0800',
    categories: ['Chronicles Reimagined'],
    tags: ['evaluation', 'debate', 'children', 'philosophy'],
    isHighlight: true
  },
  {
    slug: 'zilu-zengxi-ranyou-gongxihua',
    title: '子路、曾皙、冉有、公西华侍坐(Zilu, ZengXi, RanYou, GongxiHua sit around)',
    date: '2025-06-28 00:12:12 +0800',
    categories: ['Chronicles Reimagined'],
    tags: ['research', 'aspiration', 'principle']
  },
  {
    slug: 'special-property-battle',
    title: '别样的性能大战 (special property battle)',
    date: '2025-06-30 19:55:12 +0800',
    categories: ['Chronicles Reimagined'],
    tags: ['performance', 'programming', 'humor', 'python', 'C++']
  },
  {
    slug: 'grandpa-stroustrup-shoots-down-jvm',
    title: '할아버지 스트로스트럽, 삭제로 JVM을 격추하다 (斯特劳斯特鲁普爷爷用delete击落JVM)(Grandpa Stroustrup shoots down JVM with delete)',
    date: '2025-06-30 21:09:12 +0800',
    categories: ['Chronicles Reimagined'],
    tags: ['korea', 'stroustrup', 'jvm', 'performance', 'programming']
  },
  {
    slug: 'grandpa-stroustrup-shoots-down-python',
    title: '세미콜론으로 파이썬 통역사를 격추시킨 할아버지 스트로스트럽 (斯特劳斯特鲁普爷爷用分号击落python解释器)(Grandpa Stroustrup shoots down python interpreter with semicolon)',
    date: '2025-06-30 20:24:12 +0800',
    categories: ['Chronicles Reimagined'],
    tags: ['korea', 'stroustrup', 'python', 'performance', 'programming']
  },
  {
    slug: 'reimagining-national-server-siku-zhen',
    title: '模仿《国服司空震》(Reimagining \'National Server Siku Zhen\')',
    date: '2025-08-09 19:53:00 +0800',
    categories: ['Chronicles Reimagined'],
    tags: ['BLAS', 'programming', 'humor', 'gamer slang']
  },
  {
    slug: 'i-have-a-dream',
    title: 'I have a dream(我有一个梦想)',
    date: '2025-11-08 00:03:00 +0800',
    categories: ['Chronicles Reimagined'],
    tags: []
  },
  {
    slug: 'pay-for-the-future',
    title: 'Pay for the Future',
    date: '2025-11-07 00:00:00 +0800',
    categories: ['Diary'],
    tags: []
  },
  {
    slug: 'learn-language-from-sketch',
    title: 'Learn Language from Sketch',
    date: '2025-11-08 00:00:00 +0800',
    categories: ['Diary'],
    tags: []
  },
  {
    slug: 'anti-sex-anti-gender',
    title: 'Anti Sex, Anti Gender',
    date: '2025-11-09 00:00:00 +0800',
    categories: ['Diary'],
    tags: []
  },
  {
    slug: 'the-real-freedom',
    title: 'The Real Freedom',
    date: '2025-11-09 23:50:00 +0800',
    categories: ['Diary'],
    tags: []
  },
  {
    slug: 'a-great-manner-of-program-user-interface',
    title: 'A Great manner of program user interface',
    date: '2025-11-10 23:05:00 +0800',
    categories: ['Diary'],
    tags: [],
    isHighlight: true
  },
  {
    slug: 'internal-politics',
    title: 'Internal Politics',
    date: '2025-11-11 23:20:00 +0800',
    categories: ['Diary'],
    tags: []
  },
  {
    slug: 'intermediate-interface',
    title: 'Intermediate Interface',
    date: '2025-11-12 23:20:00 +0800',
    categories: ['Diary'],
    tags: []
  },
  {
    slug: 'best-choices',
    title: 'Best Choices',
    date: '2025-11-13 19:20:00 +0800',
    categories: ['Diary'],
    tags: []
  }
];

export function getAllPosts() {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getHighlightedPosts() {
  return getAllPosts().filter(post => post.isHighlight);
}

export function getAllCategories() {
  const categories = new Set<string>();
  posts.forEach(post => post.categories.forEach(cat => categories.add(cat)));
  return Array.from(categories);
}

export function getAllTags() {
  const tags = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter(post => post.categories.includes(category));
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter(post => post.tags.includes(tag));
}
