// src/app/news/page.tsx
import Link from "next/link";
import Image from "next/image";
import { newsArticles } from "@/data/news-article";

export default function NewsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {newsArticles.map((article) => (
          <Link
            href={`/news/${article.slug}`}
            key={article.slug}
            className="block border rounded-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Image
              src={article.image}
              alt={article.title}
              width={600}
              height={350}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <p className="text-xs uppercase text-gray-500 mb-1">
                {article.category}
              </p>
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600 mt-2">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
