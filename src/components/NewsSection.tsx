// components/NewsSection.tsx
import Image from 'next/image';

const articles = [
  {
    title: 'How to Make Creamy Banana Lemongrass and Coconut Soup: A Delicious and Nutritious Tropical Treat',
    excerpt: "Looking for a unique and comforting dish that will transport you to a tropical paradise? Look no further...",
    category: 'IN THE KITCHEN',
    timeAgo: '1 hour ago',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiJWm3YxKoIcjgjD2XX_mk8zC5Ja8gP3___rALvnry3OVKP11ICZLTfNiVKk_79d3kSidmHLMs-Fh6D7YpRfHc5llU21JHO5T4b9mRQ_RxOAok09J4p6VIrFYGPWq4gWJDJWfPcnYysaJcR/s1600/IMG_2606.JPG', // Add image path
  },
  // Add 5 more articles
];

export default function NewsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
      {/* Main Feature */}
      <div className="md:col-span-2">
        <div className="bg-white shadow-md rounded overflow-hidden">
          <Image src={articles[0].image} alt={articles[0].title} width={800} height={450} className="w-full h-auto object-cover" />
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{articles[0].title}</h1>
            <p className="text-gray-600">{articles[0].excerpt}</p>
          </div>
        </div>
      </div>

      {/* Side Articles */}
      <div className="space-y-4">
        {articles.slice(1).map((article, index) => (
          <div key={index} className="flex gap-4 border-b pb-4">
            <Image src={article.image} alt={article.title} width={100} height={70} className="object-cover rounded-md" />
            <div>
              <p className="text-xs uppercase text-gray-500">{article.category} | {article.timeAgo}</p>
              <p className="font-semibold text-sm">{article.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
