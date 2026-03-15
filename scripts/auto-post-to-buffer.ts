#!/usr/bin/env node
/**
 * Auto-poster: posts latest article to X (Twitter) + LinkedIn daily
 */

import * as fs from 'fs';
import * as path from 'path';
import { TwitterApi } from 'twitter-api-v2';

const ANTHROPIC_API_KEY   = process.env.ANTHROPIC_API_KEY || '';
const X_API_KEY           = process.env.X_API_KEY || '';
const X_API_SECRET        = process.env.X_API_SECRET || '';
const X_ACCESS_TOKEN      = process.env.X_ACCESS_TOKEN || '';
const X_ACCESS_SECRET     = process.env.X_ACCESS_SECRET || '';
const LINKEDIN_TOKEN      = process.env.LINKEDIN_TOKEN || '';

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

async function generateCopy(post: { slug: string; title: string; excerpt: string }) {
  const url = `${SITE_URL}/posts/${post.slug}`;
  const prompt = `You are the social media editor of OpenClaw News — sharp, builder-focused. Never name specific private individuals.

Article: "${post.title}"
Summary: ${post.excerpt}
URL: ${url}

Return ONLY raw JSON, no markdown:
{
  "twitter": "Single tweet. HARD MAX 255 chars total. Punchy. 1-2 emojis. URL at end. No hashtags.",
  "linkedin": "LinkedIn post 120-150 words. Bold first line. 3 short paragraphs. End with a question then URL on its own line."
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return {
      twitter: `${post.title} ${url}`.substring(0, 255),
      linkedin: `${post.title}\n\n${post.excerpt}\n\n${url}`,
    };
  }
}

async function postToX(tweet: string) {
  if (!X_API_KEY || !X_ACCESS_TOKEN) { console.log('⏭  X: skipping (no credentials)'); return; }
  if (tweet.length > 280) { console.error(`❌ X: tweet too long (${tweet.length} chars)`); return; }

  const client = new TwitterApi({
    appKey:       X_API_KEY,
    appSecret:    X_API_SECRET,
    accessToken:  X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });

  try {
    const result = await client.v2.tweet(tweet);
    console.log(`✅ X: posted! https://x.com/i/web/status/${result.data.id}`);
  } catch (err: any) {
    console.error('❌ X: failed:', err?.data || err?.message || err);
  }
}

async function getLinkedInUserId(token: string): Promise<string | null> {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) { console.error('❌ LinkedIn: failed to get user ID', await res.text()); return null; }
  const data = await res.json();
  return data.sub || null;
}

async function postToLinkedIn(text: string) {
  if (!LINKEDIN_TOKEN) { console.log('⏭  LinkedIn: skipping (no token)'); return; }

  const userId = await getLinkedInUserId(LINKEDIN_TOKEN);
  if (!userId) return;

  const body = {
    author: `urn:li:person:${userId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINKEDIN_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const data = await res.json();
    console.log(`✅ LinkedIn: posted! ID: ${data.id}`);
  } else {
    console.error('❌ LinkedIn: failed:', await res.text());
  }
}

async function main() {
  console.log('📣 Auto-poster starting...');

  if (!ANTHROPIC_API_KEY) { console.error('❌ ANTHROPIC_API_KEY not set'); process.exit(1); }

  const post = getLatestPost();
  if (!post) { console.error('❌ Could not read latest post'); process.exit(1); }
  console.log(`📰 Latest post: "${post.title}"`);

  console.log('✍️  Generating copy...');
  const copy = await generateCopy(post);
  console.log(`Twitter (${copy.twitter.length} chars): ${copy.twitter}`);
  console.log(`LinkedIn: ${copy.linkedin.substring(0, 80)}...`);

  await postToX(copy.twitter);
  await postToLinkedIn(copy.linkedin);

  console.log('\n✅ Done.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
