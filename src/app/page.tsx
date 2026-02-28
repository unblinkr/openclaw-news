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
      <main className="max-w-5xl mx-auto px-4 py-8 newspaper-body">
        {/* Masthead */}
        <div className="text-center mb-6 newspaper-masthead">
          <div className="flex justify-between text-xs text-neutral-600 mb-2">
            <span>Est. 2024</span>
            <span>Issue No. 47</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="newspaper-title text-6xl md:text-7xl font-black text-neutral-900 mb-2">
            OpenClaw News
          </h1>
          <p className="text-sm tracking-widest text-neutral-600 uppercase">
            Your Authority on AI Agents & Autonomous Systems
          </p>
        </div>

        {/* Navigation Bar */}
        <nav className="border-y border-neutral-900 py-3 mb-8">
          <ul className="flex justify-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <li><a href="/" className="hover:text-neutral-600">Home</a></li>
            <li><a href="#" className="hover:text-neutral-600">Agents</a></li>
            <li><a href="#" className="hover:text-neutral-600">Tutorials</a></li>
            <li><a href="#" className="hover:text-neutral-600">Reviews</a></li>
            <li><a href="#" className="hover:text-neutral-600">About</a></li>
          </ul>
        </nav>

        {/* Ad Banner Top */}
        <div className="ad-container py-6 mb-8">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Advertisement</p>
          <ins className="adsbygoogle"
            style={{ display: 'inline-block', width: '728px', height: '90px' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"></ins>
        </div>

        {/* Featured Article - Full Width */}
        {featured && (
          <article className="mb-12 border-b-2 border-neutral-900 pb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
                Breaking
              </span>
              <span className="text-xs text-neutral-600 uppercase tracking-wider">{featured.readTime}</span>
            </div>
            <h2 className="newspaper-headline text-4xl md:text-5xl mb-4">
              {featured.title}
            </h2>
            <p className="text-lg text-neutral-700 mb-6 drop-cap">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between border-t border-neutral-300 pt-4">
              <a href={`/posts/${featured.slug}`} className="inline-flex items-center text-sm font-semibold uppercase tracking-wider hover:text-neutral-600">
                Continue Reading →
              </a>
              <time className="text-sm text-neutral-600">{featured.date}</time>
            </div>
          </article>
        )}

        {/* Middle Section: Articles Grid + Sidebar */}
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          {/* Main Articles - 2/3 */}
          <div className="md:col-span-8">
            <h3 className="newspaper-title text-xl font-bold border-b border-neutral-900 pb-2 mb-6">
              Latest Stories
            </h3>
            <div className="newspaper-columns">
              {rest.map((post, index) => (
                <article key={post.slug} className="mb-8 break-inside-avoid">
                  <h4 className="newspaper-headline text-xl mb-2">
                    <a href={`/posts/${post.slug}`} className="hover:text-neutral-600">
                      {post.title}
                    </a>
                  </h4>
                  <p className="text-sm text-neutral-700 mb-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-xs text-neutral-600">
                    <span>{post.readTime}</span>
                    <span className="mx-2">|</span>
                    <time>{post.date}</time>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <aside className="md:col-span-4 space-y-8">
            {/* Ad Sidebar */}
            <div className="ad-container p-4">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Advertisement</p>
              <ins className="adsbygoogle"
                style={{ display: 'inline-block', width: '300px', height: '250px' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="0987654321"></ins>
            </div>

            {/* Newsletter Box */}
            <div className="border-2 border-neutral-900 p-6">
              <Newsletter />
            </div>

            {/* Quick Links */}
            <div className="border border-neutral-900 p-4">
              <h4 className="newspaper-title text-lg font-bold mb-4 border-b border-neutral-300 pb-2">
                Popular This Week
              </h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/posts/what-is-openclaw" className="hover:text-neutral-600">What is OpenClaw?</a></li>
                <li><a href="/posts/moltbook-explained" className="hover:text-neutral-600">Moltbook Explained</a></li>
                <li><a href="#" className="hover:text-neutral-600">Top 10 AI Agents</a></li>
                <li><a href="#" className="hover:text-neutral-600">The Future of Work</a></li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Bottom Ad */}
        <div className="ad-container py-6 border-t border-neutral-900">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Advertisement</p>
          <ins className="adsbygoogle"
            style={{ display: 'inline-block', width: '728px', height: '90px' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1122334455"></ins>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-900 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center newspaper-body">
            <h3 className="newspaper-title text-2xl font-bold mb-4">OpenClaw News</h3>
            <div className="flex justify-center gap-6 text-sm text-neutral-600 mb-4">
              <a href="#" className="hover:text-neutral-900">Privacy</a>
              <a href="#" className="hover:text-neutral-900">Terms</a>
              <a href="#" className="hover:text-neutral-900">Contact</a>
              <a href="#" className="hover:text-neutral-900">Subscribe</a>
            </div>
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} OpenClaw News. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
