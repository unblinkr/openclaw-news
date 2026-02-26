import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-slate-900">
              OpenClaw <span className="text-blue-600">News</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link href="/" className="text-slate-700 hover:text-slate-900">
              Home
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-slate-900">
              About
            </Link>
            <Link href="/tutorials" className="text-slate-700 hover:text-slate-900">
              Tutorials
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
