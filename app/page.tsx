import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            The Latest on <span className="text-blue-600">OpenClaw</span> <br />
            and AI Agents
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Daily news, tutorials, and insights on the AI agent revolution. Stay ahead of the curve.
          </p>
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="mb-16">
            <div className="border-2 border-blue-200 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">
                  Featured
                </span>
                <span className="text-slate-600 text-sm">{featured.readTime}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {featured.title}
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                {featured.excerpt}
              </p>
              
              <div className="flex items-center gap-4">
                <a 
                  href={`/posts/${featured.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Read Article →
                </a>
                <time className="text-slate-600">{featured.date}</time>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mb-16">
          <Newsletter />
        </div>

        {/* Recent Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Recent Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {rest.map((post) => (
              <ArticleCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center text-slate-600">
            <p className="mb-2">OpenClaw News — Your source for AI agent intelligence</p>
            <p className="text-sm">Built with Next.js · Deployed on Vercel</p>
          </div>
        </div>
      </footer>
    </>
  );
}
