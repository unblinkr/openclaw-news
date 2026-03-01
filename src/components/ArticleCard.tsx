import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readTime: string;
  image?: string;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  date,
  tag,
  readTime,
  image,
}: ArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/posts/${slug}`}>
        <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200">
          {image && (
            <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {tag}
              </span>
              <span className="text-slate-500 text-sm">{readTime}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-slate-600 mb-4 line-clamp-2">
              {excerpt}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-sm text-slate-500">{date}</time>
              <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
