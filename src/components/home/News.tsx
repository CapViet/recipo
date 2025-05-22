import Link from "next/link";
import { newsArticles } from "@/data/news-article";

export default function News() {
  const [mainArticle, ...otherArticles] = newsArticles;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-12">
      <h2 className="text-2xl font-bold border-b-2 border-red-600 mb-6">The Latest</h2>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main article */}
        <Link href={`/news/${mainArticle.slug}`} className="lg:col-span-2 block">
          <div className="flex flex-col lg:flex-row gap-4">
            <img src={mainArticle.image} alt={mainArticle.title} className="w-full lg:w-2/3  object-cover rounded" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase">{mainArticle.category} | {mainArticle.time}</p>
              <h3 className="text-xl font-bold mt-1 mb-2">{mainArticle.title}</h3>
              <p className="text-gray-700">{mainArticle.excerpt}</p>
            </div>
          </div>
        </Link>

        {/* Sidebar articles */}
        <div className="flex flex-col gap-6">
          {otherArticles.slice(0, 5).map((article) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="flex gap-4">
              <img src={article.image} alt={article.title} className="w-24 h-20 object-cover rounded" />
              <div>
                <p className="text-xs text-gray-500 uppercase">{article.category} | {article.time}</p>
                <h4 className="text-sm font-semibold">{article.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
