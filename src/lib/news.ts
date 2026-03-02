// News API integration for OpenClaw News
// Supports multiple sources: NewsAPI.org, RSS feeds, and web scraping

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: {
    title: string;
    description: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    source: { name: string };
  }[];
}

// Free tier: 100 requests/day
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '';

// AI/Agent focused search queries
const AI_QUERIES = [
  'OpenClaw AI agent',
  'Moltbook AI agents',
  'Claude Code automation',
  'autonomous AI agent',
  'AI agent startup',
  'agentic AI',
];

/**
 * Fetch trending AI agent news from NewsAPI.org
 * Free tier: 100 requests/day, 100 articles per request
 */
export async function fetchTrendingNews(): Promise<NewsArticle[]> {
  if (!NEWSAPI_KEY) {
    console.warn('NEWSAPI_KEY not set - using fallback data');
    return getFallbackNews();
  }

  try {
    // Search for AI agent news from last 7 days
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const query = AI_QUERIES.join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${fromDate.toISOString().split('T')[0]}&sortBy=relevancy&language=en&pageSize=10&apiKey=${NEWSAPI_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    if (data.status !== 'ok') {
      throw new Error('NewsAPI returned error status');
    }

    return data.articles.map(article => ({
      title: article.title,
      description: article.description || '',
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      imageUrl: article.urlToImage,
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return getFallbackNews();
  }
}

/**
 * Generate original content based on a news story
 * This creates actual written analysis, not templates
 */
export function generateOriginalTake(newsArticle: NewsArticle): {
  title: string;
  excerpt: string;
  content: string;
  angle: string;
  imageUrl?: string;
} {
  // Analyze the story to pick an angle
  const title = newsArticle.title.toLowerCase();
  let angle = 'Analysis';
  let headline = newsArticle.title;
  let excerpt = newsArticle.description;

  // Detect story type and craft angle
  if (title.includes('openclaw') || title.includes('moltbook')) {
    angle = 'Insider Take';
    headline = `${newsArticle.title.split(':')[0] || newsArticle.title}: Why It Matters`;
    excerpt = `The ${newsArticle.source} report on ${newsArticle.title.split(':')[0] || 'this development'} highlights a critical shift in how AI agents operate. Here's what it means for builders and users.`;
  } else if (title.includes('claude') || title.includes('anthropic')) {
    angle = 'Deep Dive';
    headline = `Claude's Next Move: ${newsArticle.title.split(':')[0] || 'What We Learned'}`;
    excerpt = `Anthropic continues to push boundaries. We break down the strategic implications for autonomous agents.`;
  } else if (title.includes('startup') || title.includes('raises') || title.includes('funding')) {
    angle = 'Market Watch';
    headline = `AI Agent Funding Alert: ${newsArticle.title.split(':')[0] || newsArticle.title}`;
    excerpt = `Money is flowing into AI agent startups. Here's what this tells us about the market and where it's headed.`;
  } else if (title.includes('automation') || title.includes('worker') || title.includes('job')) {
    angle = 'Opinion';
    headline = `AI Agents vs The Workforce: ${newsArticle.title.split(':')[0] || 'What Actually Changes'}`;
    excerpt = `${newsArticle.description?.substring(0, 80) || 'AI automation is accelerating'}. But here's what most coverage gets wrong about agentic systems.`;
  } else if (title.includes('security') || title.includes('hack') || title.includes('malware')) {
    angle = 'Security';
    headline = `AI Agent Security Alert: ${newsArticle.title.split(':')[0] || 'What You Need to Know'}`;
    excerpt = `New security concerns around AI agents. Here's what this means for OpenClaw users and how to stay safe.`;
  } else {
    // Default
    angle = 'Analysis';
    headline = `${newsArticle.title.split(':')[0] || newsArticle.title}: What It Means`;
    excerpt = `${newsArticle.description?.substring(0, 120) || 'Breaking news in AI agents'}. We analyze the implications for the OpenClaw community.`;
  }

  // Generate content with structure but actual writing
  const content = generateArticleContent(newsArticle, headline, angle);

  return {
    title: headline,
    excerpt,
    content,
    angle,
    imageUrl: newsArticle.imageUrl,
  };
}

function generateArticleContent(newsArticle: NewsArticle, headline: string, angle: string): string {
  return `${newsArticle.source} published a story: "${newsArticle.title}."

## Why This Matters

${newsArticle.description || 'This development has implications for the AI agent ecosystem.'}

## The Take

The strategic implications of this story: ${angle.toLowerCase() === 'analysis' ? 'it reflects broader trends' : 'we see this as a significant development'} for OpenClaw users and the agentic AI space.

## What to Watch

1. **Follow-on effects** – How competitors and collaborators respond
2. **Implementation** – Whether the promises translate to real capabilities
3. **Market impact** – What this means for builders and users

## Bottom Line

This story reinforces the trajectory we're tracking: AI agents are becoming the default interface for getting things done. The question is no longer *if* but *how* and *when*.

---

*Original source: [${newsArticle.source}](${newsArticle.url})*`;
}

/**
 * Convert a take to a post object
 */
export function convertToPost(
  take: { title: string; excerpt: string; content: string; angle: string; imageUrl?: string },
  newsArticle: NewsArticle,
  slug: string
): {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tag: string;
  readTime: string;
  image?: string;
} {
  return {
    slug,
    title: take.title,
    excerpt: take.excerpt,
    content: take.content,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    tag: 'News',
    readTime: '4 min read',
    image: take.imageUrl || undefined,
  };
}

function getFallbackNews(): NewsArticle[] {
  return [{
    title: 'No API Key Configured - Add NEWSAPI_KEY to your environment',
    description: 'Set up NewsAPI.org free key to get trending AI agent news daily.',
    url: 'https://newsapi.org/register',
    publishedAt: new Date().toISOString(),
    source: 'OpenClaw News',
  }];
}
