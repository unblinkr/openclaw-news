#!/usr/bin/env node
/**
 * Auto-poster: reads the latest article and posts to Buffer
 * Uses Buffer API v1 with correct auth header format
 */

import * as fs from 'fs';
import * as path from 'path';

const BUFFER_TOKEN = process.env.BUFFER_TOKEN || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SITE_URL = 'https://openclaw-news.vercel.app';

function getLatestPost() {
  const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
  const content = fs.readFileSync(postsPath, 'utf-8');

  // Find first real post entry (skip interface definition)
  const arrayStart = content.indexOf('export const posts: Post[] = [');
  const postSection = content.slice(arrayStart);

  const slugMatch = postSection.match(/slug: "([^"]+)"/);
  const titleMatch = postSection.match(/title: "([^"]+)"/);
  const excerptMatch = postSection.match(/excerpt: "([^"]+)"/);
  const tagMatch = postSection.match(/tag: "([^"]+)"/);

  if (!slugMatch) return null;

  return {
    slug: slugMatch[1],
    title: titleMatch?.[1] || '',
    excerpt: excerptMatch?.[1] || '',
    tag: tagMatch?.[1] || 'News',
  };
}

async function generateSocialCopy(post: { slug: string; title: string; excerpt: string; tag: string }) {
  const url = `${SITE_URL}/posts/${post.slug}`;

  const prompt = `You are the social media editor of OpenClaw News — sharp, credible, builder-focused. Never name specific private individuals.

Article: "${post.title}"
Summary: ${post.excerpt}
URL: ${url}

Return ONLY raw JSON, no markdown, no backticks:
{
  "twitter": "Single tweet. HARD MAX 220 chars including the URL. Punchy. 1-2 emojis. URL at end.",
  "linkedin": "LinkedIn post for founders/builders. 120-150 words. Bold first line. 3 short paragraphs. End with a question then URL on its own line."
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
      twitter: `${post.title} ${url}`.substring(0, 220),
      linkedin: `${post.title}\n\n${post.excerpt}\n\n${url}`,
    };
  }
}

async function bufferRequest(endpoint: string, method = 'GET', body?: URLSearchParams) {
  const baseUrl = 'https://api.bufferapp.com/1';
  const url = method === 'GET'
    ? `${baseUrl}/${endpoint}?access_token=${BUFFER_TOKEN}`
    : `${baseUrl}/${endpoint}.json`;

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${BUFFER_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (method === 'POST' && body) {
    body.append('access_token', BUFFER_TOKEN);
    options.body = body;
  }

  const res = await fetch(url, options);
  const text = await res.text();

  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

async function getProfiles() {
  // Try both Bearer header and query param approaches
  console.log('Trying Bearer token auth...');
  let result = await bufferRequest('profiles.json');

  if (!result.ok || !Array.isArray(result.data)) {
    console.log(`Bearer failed (${result.status}), trying query param...`);
    const res = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${BUFFER_TOKEN}`);
    const text = await res.text();
    console.log(`Query param response (${res.status}):`, text.substring(0, 200));
    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) return data;
      console.error('Profiles response:', JSON.stringify(data));
      return [];
    } catch {
      console.error('Non-JSON response:', text.substring(0, 300));
      return [];
    }
  }

  return Array.isArray(result.data) ? result.data : [];
}

async function main() {
  if (!BUFFER_TOKEN) { console.error('❌ BUFFER_TOKEN not set'); process.exit(1); }
  if (!ANTHROPIC_API_KEY) { console.error('❌ ANTHROPIC_API_KEY not set'); process.exit(1); }

  console.log('📣 Auto-poster starting...');
  console.log(`🔑 Token prefix: ${BUFFER_TOKEN.substring(0, 8)}...`);

  const post = getLatestPost();
  if (!post) { console.error('❌ Could not read latest post'); process.exit(1); }
  console.log(`📰 Latest post: "${post.title}"`);

  console.log('✍️  Generating social copy...');
  const copy = await generateSocialCopy(post);
  console.log(`Twitter (${copy.twitter.length} chars): ${copy.twitter}`);
  console.log(`LinkedIn: ${copy.linkedin.substring(0, 100)}...`);

  console.log('\n📡 Fetching Buffer profiles...');
  const profiles = await getProfiles();

  if (profiles.length === 0) {
    console.error('❌ No Buffer profiles found — check token at buffer.com/app/account/apps');
    process.exit(1);
  }

  console.log(`✅ Found ${profiles.length} profiles:`);
  profiles.forEach((p: any) => console.log(`  - ${p.service}: ${p.service_username || p.formatted_username}`));

  let posted = 0;
  for (const profile of profiles) {
    const service = (profile.service || '').toLowerCase();
    const text = (service.includes('twitter') || service.includes('x'))
      ? copy.twitter
      : copy.linkedin;

    const body = new URLSearchParams();
    body.append('text', text);
    body.append('profile_ids[]', profile.id);

    const result = await bufferRequest('updates/create.json', 'POST', body);

    if (result.ok && (result.data?.success || result.data?.id)) {
      console.log(`✅ Queued to ${service} (${profile.service_username})`);
      posted++;
    } else {
      console.error(`❌ Failed ${service}: ${JSON.stringify(result.data).substring(0, 200)}`);
    }
  }

  console.log(`\n🎉 Done. Queued to ${posted}/${profiles.length} profiles.`);
  if (posted === 0) process.exit(1);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
