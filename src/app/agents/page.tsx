import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/lib/posts";

export default function AgentsPage() {
  const posts = getAllPosts().filter(p => 
    p.title.toLowerCase().includes('openclaw') || 
    p.tag === 'Explainer'
  );

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-2">Agents</h1>
          <p className="text-sm tracking-widest text-neutral-600 uppercase">AI Agent Reviews & Guides</p>
        </div>

        <nav className="border-y border-neutral-900 py-3 mb-8">
          <ul className="flex justify-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <li><a href="/" className="hover:text-neutral-600">Home</a></li>
            <li><a href="/agents" className="text-neutral-900 border-b-2 border-neutral-900">Agents</a></li>
            <li><a href="/tutorials" className="hover:text-neutral-600">Tutorials</a></li>
            <li><a href="/reviews" className="hover:text-neutral-600">Reviews</a></li>
            <li><a href="/about" className="hover:text-neutral-600">About</a></li>
          </ul>
        </nav>

        <div className="prose max-w-none mb-12">
          <h2>Popular AI Agents</h2>
          <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
            {posts.map(post => (
              <a key={post.slug} href={`/posts/${post.slug}`} className="block border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{post.excerpt}</p>
                <span className="text-xs text-neutral-500">{post.readTime} • {post.date}</span>
              </a>
            ))}
          </div>

          <div className="mt-12 p-6 bg-neutral-100 rounded-xl">
            <h3 className="mt-0">Coming Soon</h3>
            <p>Full agent comparison database with pricing, features, and user ratings.</p>
          </div>
        </div>

        <div className="border-2 border-neutral-900 p-6">
          <Newsletter />
        </div>
      </main>

      <footer className="border-t-2 border-neutral-900 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} OpenClaw News</p>
        </div>
      </footer>
    </>
  );
}
