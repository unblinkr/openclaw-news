#!/usr/bin/env node
/**
 * Auto-poster: posts latest article to X (Twitter) daily
 * Uses twitter-api-v2 with OAuth 1.0a user auth
 */

import * as fs from 'fs';
import * as path from 'path';
import { TwitterApi } from 'twitter-api-v2';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const X_API_KEY         = process.env.X_API_KEY || '';
const X_API_SECRET      = process.env.X_API_SECRET || '';
const X_ACCESS_TOKEN    = process.env.X_ACCESS_TOKEN || '';
const X_ACCESS_SECRET   = process.env.X_ACCESS_SECRET || '';

const SITE_URL = 'https://openclaw-news.vercel.app';

function getLatestPost() {
  const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
  const content = fs.readFileSync(postsPath, 'utf-8');
  const arrayStart = content.indexOf('export const posts: Post[] = [');
  const postSection = content.slice(arrayStart);

  const slugMatch    = postSection.match(/slug: "([^"]+)"/);
  const titleMatch   = postSection.match(/title: "([^"]+)"/);
  const excerptMatch = postSection.match(/excerpt: "([^"]+)"/);

  if (!slugMatch) return null;
  return {
    slug:    slugMatch[1],
    title:   titleMatch?.[1]  || '',
    excerpt: excerptMatch?.[1] || '',
  };
}

async function generateTweet(post: { slug: string; title: string; excerpt: string }): Promise<string> {
  const url = `${SITE_URL}/posts/${post.slug}`;

  const prompt = `You are the social media editor of OpenClaw News — sharp, builder-focused. Never name specific private individuals.

Article: "${post.title}"
Summary: ${post.excerpt}
URL: ${url}

Write a single tweet. Rules:
- HARD MAX 255 characters total (including URL)
- Punchy opening line
- 1-2 relevant emojis
- URL must be at the very end
- No hashtags
- Count characters carefully

Return ONLY the tweet text, nothing else.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const tweet = data.content?.[0]?.text?.trim() || '';

  // Hard truncate if still over 280
  if (tweet.length > 280) {
    const truncated = tweet.substring(0, 280 - url.length - 4) + '... ' + url;
    return truncated;
  }
  return tweet;
}

async function main() {
  console.log('📣 Auto-poster starting...');

  // Validate env vars
  const missing = [
    !ANTHROPIC_API_KEY && 'ANTHROPIC_API_KEY',
    !X_API_KEY         && 'X_API_KEY',
    !X_API_SECRET      && 'X_API_SECRET',
    !X_ACCESS_TOKEN    && 'X_ACCESS_TOKEN',
    !X_ACCESS_SECRET   && 'X_ACCESS_SECRET',
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }

  const post = getLatestPost();
  if (!post) { console.error('❌ Could not read latest post'); process.exit(1); }
  console.log(`📰 Latest post: "${post.title}"`);

  console.log('✍️  Generating tweet...');
  const tweet = await generateTweet(post);
  console.log(`\nTweet (${tweet.length} chars):\n${tweet}\n`);

  if (tweet.length > 280) {
    console.error(`❌ Tweet too long: ${tweet.length} chars`);
    process.exit(1);
  }

  console.log('🐦 Posting to X...');
  const client = new TwitterApi({
    appKey:            X_API_KEY,
    appSecret:         X_API_SECRET,
    accessToken:       X_ACCESS_TOKEN,
    accessSecret:      X_ACCESS_SECRET,
  });

  try {
    const result = await client.v2.tweet(tweet);
    console.log(`✅ Posted to X! Tweet ID: ${result.data.id}`);
    console.log(`   https://x.com/i/web/status/${result.data.id}`);
  } catch (err: any) {
    console.error('❌ X post failed:', err?.data || err?.message || err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
