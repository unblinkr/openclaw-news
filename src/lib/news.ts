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
 * This is where you add your "take" - analysis, opinion, context
 */
export function generateOriginalTake(newsArticle: NewsArticle): {
  title: string;
  excerpt: string;
  content: string;
  angle: string;
} {
  // Analyze the story to pick an angle
  const title = newsArticle.title.toLowerCase();

  let angle = 'Analysis';
  let headline = newsArticle.title;
  let excerpt = newsArticle.description;

  // Detect story type and craft angle
  if (title.includes('openclaw') || title.includes('moltbook')) {
    angle = 'Insider Take';
    headline = `Why ${newsArticle.title.split(':')[0] || newsArticle.title} Matters for AI Agents`;
    excerpt = `The ${newsArticle.source} report on ${newsArticle.title.split(':')[0] || 'this development'} highlights a critical shift in how AI agents operate. Here's what it means for builders and users.`;
  } else if (title.includes('claude') || title.includes('anthropic')) {
    angle = 'Deep Dive';
    headline = `Claude's Next Move: ${newsArticle.title.split(':')[0] || 'What We Learned'}`;
    excerpt = `Anthropic continues to push boundaries. ${newsArticle.description?.substring(0, 100) || ''}... We break down the strategic implications.`;
  } else if (title.includes('startup') || title.includes('raises') || title.includes('funding')) {
    angle = 'Market Watch';
    headline = `The AI Agent Funding Craze: ${newsArticle.title.split(':')[0] || 'What VCs Are Betting On'}`;
    excerpt = `Money is flowing into AI agent startups. ${newsArticle.description?.substring(0, 80) || ''}... Here's what this tells us about the market.`;
  } else if (title.includes('automation') || title.includes('worker') || title.includes('job')) {
    angle = 'Opinion';
    headline = `AI Agents Are Coming for Your Workflow: ${newsArticle.title.split(':')[0] || ''}`;
    excerpt = `${newsArticle.description?.substring(0, 100) || 'AI automation is accelerating'}. But here's what most coverage gets wrong about agentic systems.`;
  } else {
    // Default analysis
    angle = 'Analysis';
    headline = `${newsArticle.title.split(':')[0] || newsArticle.title}: What It Means`;
    excerpt = `${newsArticle.description?.substring(0, 120) || 'Breaking news in AI agents'}. We analyze the implications for the OpenClaw community.`;
  }

  // Generate content structure
  const content = `# ${headline}

${newsArticle.description || ''}

## Why This Matters

[This section would be generated with AI based on the original article, adding context about OpenClaw, similar previous developments, and strategic implications]

## The Take

The ${newsArticle.source} report highlights something important: [analysis would go here]. For anyone building or using AI agents like OpenClaw, this is a signal that [implications would follow].

## What to Watch

1. [Point 1 based on article]
2. [Point 2 based on article]
3. [Point 3 based on article]

## Bottom Line

[Concluding take that ties back to OpenClaw ecosystem]

---

*Original source: [${newsArticle.source}](${newsArticle.url})*
`;

  return {
    title: headline,
    excerpt,
    content,
    angle,
  };
}

/**
 * Fallback news when API is unavailable
 */
function getFallbackNews(): NewsArticle[] {
  return [
    {
      title: 'No API Key Configured - Add NEWSAPI_KEY to your environment',
      description: 'Set up NewsAPI.org free key to get trending AI agent news daily.',
      url: 'https://newsapi.org/register',
      publishedAt: new Date().toISOString(),
      source: 'OpenClaw News',
    },
  ];
}

/**
 * Convert news article to post format for the site
 */
export function convertToPost(
  take: ReturnType<typeof generateOriginalTake>,
  sourceArticle: NewsArticle,
  slug: string
) {
  return {
    slug,
    title: take.title,
    excerpt: take.excerpt,
    content: take.content,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    tag: take.angle,
    readTime: '4 min read',
    source: sourceArticle.source,
    sourceUrl: sourceArticle.url,
  };
}
