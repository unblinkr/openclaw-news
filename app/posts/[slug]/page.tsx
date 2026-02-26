import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import { getPostBySlug, getAllPosts } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {post.tag}
            </span>
            <time className="text-slate-600 text-sm">{post.date}</time>
            <span className="text-slate-600 text-sm">·</span>
            <span className="text-slate-600 text-sm">{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-slate-600">
            {post.excerpt}
          </p>
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        {/* Newsletter CTA */}
        <div className="mt-16">
          <Newsletter />
        </div>
      </article>
    </>
  );
}
