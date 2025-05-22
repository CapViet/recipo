import { newsArticles } from '@/data/news-article';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = newsArticles.find((a) => a.slug === params.slug);
  if (!article) return notFound();

  const htmlFilePath = path.join(process.cwd(), 'public', article.htmlPath);
  const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 prose lg:prose-xl">
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
