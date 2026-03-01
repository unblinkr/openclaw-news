import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import { getAllPosts } from "@/lib/posts";

export default function ReviewsPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-2">Reviews</h1>
          <p className="text-sm tracking-widest text-neutral-600 uppercase">In-depth AI Tool Reviews</p>
        </div>

        <nav className="border-y border-neutral-900 py-3 mb-8">
          <ul className="flex justify-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <li><a href="/" className="hover:text-neutral-600">Home</a></li>
            <li><a href="/agents" className="hover:text-neutral-600">Agents</a></li>
            <li><a href="/tutorials" className="hover:text-neutral-600">Tutorials</a></li>
            <li><a href="/reviews" className="text-neutral-900 border-b-2 border-neutral-900">Reviews</a></li>
            <li><a href="/about" className="hover:text-neutral-600">About</a></li>
          </ul>
        </nav>

        <div className="mb-12">
          {posts.map(post => (
            <article key={post.slug} className="border-b border-neutral-200 py-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-neutral-900 text-white text-xs uppercase">{post.tag}</span>
                <span className="text-sm text-neutral-500">{post.date}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                <a href={`/posts/${post.slug}`} className="hover:text-neutral-600">{post.title}</a>
              </h3>
              <p className="text-neutral-700">{post.excerpt}</p>
            </article>
          ))}
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
