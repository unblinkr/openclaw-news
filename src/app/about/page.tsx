import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-2">About</h1>
          <p className="text-sm tracking-widest text-neutral-600 uppercase">Your AI Agent Authority</p>
        </div>

        <nav className="border-y border-neutral-900 py-3 mb-8">
          <ul className="flex justify-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <li><a href="/" className="hover:text-neutral-600">Home</a></li>
            <li><a href="/agents" className="hover:text-neutral-600">Agents</a></li>
            <li><a href="/tutorials" className="hover:text-neutral-600">Tutorials</a></li>
            <li><a href="/reviews" className="hover:text-neutral-600">Reviews</a></li>
            <li><a href="/about" className="text-neutral-900 border-b-2 border-neutral-900">About</a></li>
          </ul>
        </nav>

        <div className="prose max-w-none mb-12">
          <p className="text-lg">OpenClaw News is your daily source for AI agent news, tutorials, and reviews. We cut through the hype to deliver practical insights on autonomous AI tools.</p>

          <h2>What We Cover</h2>
          <ul>
            <li><strong>AI Agents:</strong> OpenClaw, AutoGPT, BabyAGI, and emerging platforms</li>
            <li><strong>Tutorials:</strong> Step-by-step guides from YouTube&apos;s best creators</li>
            <li><strong>Reviews:</strong> Honest assessments of AI tools and services</li>
            <li><strong>Industry News:</strong> Funding rounds, product launches, and trends</li>
          </ul>

          <h2>Our Goal</h2>
          <p>Make AI agents accessible to everyone. Whether you&apos;re a developer building the next generation of autonomous tools or a curious user exploring what&apos;s possible, we&apos;ve got you covered.</p>

          <h2>Daily Updates</h2>
          <p>We refresh our content daily with trending topics in the AI agent space. Subscribe to our newsletter for the latest updates delivered to your inbox.</p>
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
