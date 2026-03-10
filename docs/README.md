# Developer Documentation

## How to Add a New Post

This blog is built with Next.js and TypeScript. Posts are written directly as React components.

### 1. Create a new page

Create a new folder in `app/posts/` with your post's slug (e.g., `my-new-post`).
Inside that folder, create a `page.tsx` file.

### 2. Structure the component

Use the `PostLayout` component to wrap your content. You can use standard HTML/React elements,
as well as the provided `CodeBlock` and `Math` components for rich content.

### 3. Register the post

Open `lib/posts.ts` and add your new post's metadata to the `posts` array.

### 4. Set Highlights for the Home Page

To manually choose which posts appear in the "Highlights" section on the home page, add the `isHighlight: true` property to the post's metadata in `lib/posts.ts`.

```typescript
// Example in lib/posts.ts
{
  slug: 'my-new-post',
  title: 'My New Post',
  date: '2026-01-01 12:00:00 +0800',
  categories: ['Tech'],
  tags: ['nextjs'],
  isHighlight: true // Add this line to feature the post on the home page
}
```

### Example Post Template

```tsx
import PostLayout from '@/components/PostLayout';
import CodeBlock from '@/components/CodeBlock';
import Math from '@/components/Math';

export default function MyNewPost() {
  return (
    <PostLayout
      title="My New Post"
      date="2026-01-01 12:00:00 +0800"
      categories={['Tech']}
      tags={['nextjs', 'react']}
    >
      <p>This is the introduction to my new post.</p>
      
      <h2>Section 1</h2>
      <p>Here is some math:</p>
      <Math math="E = mc^2" block />
      
      <h2>Section 2</h2>
      <p>Here is some code:</p>
      <CodeBlock language="typescript" code="const x = 1;" />
    </PostLayout>
  );
}
```

---

## How to Deploy to GitHub Pages Manually

This project is configured for static export, making it fully compatible with GitHub Pages.

### 1. Configure the Base Path (Optional)

If you are deploying to a user site (e.g., `https://<username>.github.io`), you don't need to change anything.

If you are deploying to a project site (e.g., `https://<username>.github.io/<repository-name>`), you must update `next.config.ts` to include the `basePath`:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ...
  output: 'export',
  basePath: '/<repository-name>', // Uncomment and set this to your repository name
  // ...
};
```

### 2. Build the Project

Run the following command to generate the static files:

```bash
bun run build
```

This will create an `out` directory containing your fully compiled static website.

### 3. Deploy the `out` Folder

You need to push the contents of the `out` directory to your repository (typically to a branch named `gh-pages` or `main` depending on your GitHub Pages settings).

A common manual deployment workflow using `git` is:

```bash
# Navigate into the build output directory
cd out

# Initialize a new git repository
git init
git checkout -b main

# Add and commit the files
git add -A
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch of your repository
git push -f git@github.com:<username>/<repository-name>.git main:gh-pages
```

### 4. Configure GitHub Pages Settings

1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set the **Source** to **Deploy from a branch**.
4. Select the `gh-pages` branch and the `/ (root)` folder.
5. Click **Save**.

Your site will be live at your GitHub Pages URL shortly!

---

## Structure & Main APIs

### Directory Structure

- `app/`: Next.js App Router pages.
- `app/posts/`: Individual blog post pages.
- `components/`: Reusable React components.
- `lib/`: Utility functions and data (e.g., `posts.ts`).
- `public/`: Static assets like images.
- `public/assets/`: Directory for pictures, videos, and other assets.

### Components API

#### `<PostLayout />`
The main wrapper for blog posts. Handles typography, metadata, and animations.
- `title` (string): The title of the post.
- `date` (string): The publication date.
- `categories` (string[]): Optional array of categories.
- `tags` (string[]): Optional array of tags.
- `children` (ReactNode): The content of the post.

#### `<CodeBlock />`
Renders syntax-highlighted code snippets using `react-syntax-highlighter`.
- `language` (string): The programming language (e.g., 'typescript', 'python').
- `code` (string): The source code to highlight.

#### `<Math />`
Renders LaTeX math formulas using KaTeX.
- `math` (string): The LaTeX formula.
- `block` (boolean): Optional. Set to `true` for block-level display equations.
