# News System Setup

This document explains how to set up the daily news automation for OpenClaw News.

## Quick Setup

### 1. Get NewsAPI Key (Free)

1. Go to [https://newsapi.org/register](https://newsapi.org/register)
2. Sign up for a free account
3. Copy your API key
4. Add to your environment:

```bash
export NEWSAPI_KEY="your-api-key-here"
```

Or create a `.env.local` file:

```
NEWSAPI_KEY=your-api-key-here
```

**Free Tier Limits:**
- 100 requests/day
- 100 articles per request
- Non-commercial use only

### 2. Test the News Fetch

```bash
# Run the generator script
npx ts-node scripts/generate-daily-post.ts
```

## How It Works

1. **Fetch**: Pulls trending AI/agent news from NewsAPI
2. **Filter**: Selects most relevant AI agent story
3. **Analyze**: Generates original angle/take on the story
4. **Publish**: Adds new post to `src/lib/posts.ts`
5. **Build**: Rebuild and deploy the site

## Automation Options

### Option A: GitHub Actions (Recommended)

Add this to `.github/workflows/daily-news.yml`:

```yaml
name: Daily News Update

on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC daily
  workflow_dispatch:  # Manual trigger

jobs:
  update-news:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx ts-node scripts/generate-daily-post.ts
        env:
          NEWSAPI_KEY: ${{ secrets.NEWSAPI_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}  # Optional for AI-generated content
      - run: |
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add -A
          git commit -m "Add daily news $(date +%Y-%m-%d)" || exit 0
          git push
```

Add your API key to GitHub Secrets:
- Go to Settings → Secrets → Actions
- Add `NEWSAPI_KEY`

### Option B: RSS Fallback

If NewsAPI runs out, you can use RSS feeds. Add to `src/lib/news.ts`:

```typescript
const RSS_FEEDS = [
  'https://techcrunch.com/tag/artificial-intelligence/feed/',
  'https://venturebeat.com/tag/ai/feed/',
  'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
];
```

### Option C: Perplexity API (Paid but good)

If you want AI-generated original content:

1. Get API key at [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
2. Use it to generate full articles from news summaries

## Content Workflow

The current system creates a **template** post with:
- Headline based on news story
- Excerpt summarizing the angle
- Content structure with placeholders
- Source attribution

**You should edit the generated post** to add:
1. Your specific insights
2. Connections to OpenClaw
3. Personal opinions/takes
4. Any corrections

Then commit and push.

## Going Full Auto (with AI)

To fully automate with AI-generated content:

1. Add OpenAI API key to environment
2. Un-comment the AI content generation in `src/lib/news.ts`
3. The script will use GPT to write complete articles

**Cost**: ~$0.01-0.05 per article (very cheap)

## Alternative News Sources

| Source | Type | Free Tier | Best For |
|--------|------|-----------|----------|
| NewsAPI.org | API | 100/day | General AI news |
| NewsData.io | API | 500/month | Tech focused |
| RSS Feeds | Direct | Unlimited | Specific sites |
| Hacker News | API | Unlimited | Dev community |
| Reddit API | API | 60/min | Community buzz |

## Troubleshooting

**"No API Key Configured"**
- You need to set `NEWSAPI_KEY` environment variable

**"No relevant AI articles found"**
- The query might be too narrow
- Try different keywords in `AI_QUERIES` array

**"Could not find posts array"**
- Make sure `src/lib/posts.ts` exists and has the expected format

## Next Steps

1. Get NewsAPI key
2. Test with `npx ts-node scripts/generate-daily-post.ts`
3. Set up GitHub Action for automation
4. Customize the prompt/angle generation in `src/lib/news.ts`
