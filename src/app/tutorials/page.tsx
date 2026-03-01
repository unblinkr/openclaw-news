import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";

interface Tutorial {
  id: string;
  title: string;
  channel: string;
  description: string;
}

const tutorials: Tutorial[] = [
  {
    id: "PLlrxD0HtieHgKcRjd5-8DT9TbwdlDO-OC",
    title: "AI Agents for Beginners - Full Course",
    channel: "Microsoft Learning",
    description: "10-lesson course taking you from concept to code. Covers fundamentals of building AI agents with practical examples."
  },
  {
    id: "PVs7ZnWXTcc",
    title: "Master THESE 4 Stages of AI Agents in 2025!",
    channel: "AI Futures",
    description: "Learn the complete progression from beginner to pro in AI agent development. Covers all 4 stages with real examples."
  },
  {
    id: "upblQZigz0U",
    title: "Agentic AI Full Course 2025",
    channel: "Edureka",
    description: "Complete tutorial on Agentic AI covering frameworks, implementation and use cases. Perfect for beginners."
  },
  {
    id: "77nHShlpCfQ",
    title: "The Definitive Guide to Building AI Agents",
    channel: "AI Dev Skool",
    description: "Frameworks, patterns and use cases for building production-ready AI agents in 2025."
  },
  {
    id: "ftBWgcwvEk4",
    title: "8 Hour AI Agents Course in 30 Minutes",
    channel: "Deep Learning AI",
    description: "Condensed comprehensive course covering everything you need to know about AI agents."
  },
  {
    id: "a8NA0WGI9OI",
    title: "AI Agents Tutorial for Beginners 2026 - Step by Step",
    channel: "AI Engineering",
    description: "Ultimate guide for beginners to build AI agents from scratch. Step-by-step implementation."
  }
];

export default function TutorialsPage() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Masthead */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-2">
            Tutorials
          </h1>
          <p className="text-sm tracking-widest text-neutral-600 uppercase">
            Learn AI Agents from the Best
          </p>
        </div>

        {/* Navigation Bar */}
        <nav className="border-y border-neutral-900 py-3 mb-8">
          <ul className="flex justify-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <li><a href="/" className="hover:text-neutral-600">Home</a></li>
            <li><a href="/agents" className="hover:text-neutral-600">Agents</a></li>
            <li><a href="/tutorials" className="text-neutral-900 border-b-2 border-neutral-900">Tutorials</a></li>
            <li><a href="/reviews" className="hover:text-neutral-600">Reviews</a></li>
            <li><a href="/about" className="hover:text-neutral-600">About</a></li>
          </ul>
        </nav>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {tutorials.map((tutorial) => (
            <article key={tutorial.id} className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-video bg-neutral-100">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${tutorial.id}`}
                  title={tutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-3">
                  {tutorial.channel}
                </p>
                <p className="text-neutral-700">
                  {tutorial.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-2 border-neutral-900 p-6 mb-12">
          <Newsletter />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-900 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} OpenClaw News. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
