#!/usr/bin/env node
/**
 * Auto-poster: reads the latest article from posts.ts and posts to Buffer
 * Runs after generate-daily-post.ts in GitHub Actions
 * Requires: BUFFER_TOKEN, ANTHROPIC_API_KEY env vars
 */

import * as fs from 'fs';
import * as path from 'path';

const BUFFER_TOKEN = process.env.BUFFER_TOKEN || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SITE_URL = 'https://openclaw-news.vercel.app';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
}

function getLatestPost(): Post | null {
  const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
  const content = fs.readFileSync(postsPath, 'utf-8');

  const slugMatch = content.match(/slug: "([^"]+)"/);
  const titleMatch = content.match(/title: "([^"]+)"/);
  const excerptMatch = content.match(/excerpt: "([^"]+)"/);
  const tagMatch = content.match(/tag: "([^"]+)"/);

  // Skip interface fields
  if (!slugMatch || slugMatch[1] === 'string') return null;

  return {
    slug: slugMatch[1],
    title: titleMatch?.[1] || '',
    excerpt: excerptMatch?.[1] || '',
    tag: tagMatch?.[1] || 'News',
  };
}

async function generateSocialCopy(post: Post): Promise<{ twitter: string; linkedin: string }> {
  const url = `${SITE_URL}/posts/${post.slug}`;

  const prompt = `You are the social media editor of OpenClaw News — sharp, credible, builder-focused. Never name specific private individuals.

Article: "${post.title}"
Summary: ${post.excerpt}
URL: ${url}

Return ONLY raw JSON, no markdown:
{
  "twitter": "Single tweet max 240 chars total including the URL. Punchy. 1-2 emojis. Must end with the URL.",
  "linkedin": "LinkedIn post for founders/builders. 120-150 words. Bold first line. 3 short paragraphs. End with a question then the URL on its own line."
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
    const url2 = `${SITE_URL}/posts/${post.slug}`;
    return {
      twitter: `${post.title} ${url2}`.substring(0, 240),
      linkedin: `${post.title}\n\n${post.excerpt}\n\n${url2}`,
    };
  }
}

async function getBufferProfiles(): Promise<{ id: string; service: string; name: string }[]> {
  const res = await fetch(`https://api.bufferapp.com/1/profiles.json?access_token=${BUFFER_TOKEN}`);
  if (!res.ok) {
    console.error(`Buffer profiles error: ${res.status} ${await res.text()}`);
    return [];
  }
  const profiles = await res.json();
  if (!Array.isArray(profiles)) {
    console.error('Unexpected Buffer response:', profiles);
    return [];
  }
  return profiles.map((p: any) => ({
    id: p.id,
    service: p.service,
    name: p.service_username || p.formatted_username || p.id,
  }));
}

async function postToBuffer(profileId: string, text: string, service: string): Promise<boolean> {
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('profile_ids[]', profileId);
  params.append('access_token', BUFFER_TOKEN);
  params.append('now', 'false'); // Add to queue, not immediate

  const res = await fetch('https://api.bufferapp.com/1/updates/create.json', {
    method: 'POST',
    body: params,
  });

  const data = await res.json();
  if (data.success || data.id) {
    console.log(`✅ Queued to Buffer [${service}]`);
    return true;
  } else {
    console.error(`❌ Buffer error [${service}]:`, data.message || data.error || JSON.stringify(data));
    return false;
  }
}

async function main() {
  if (!BUFFER_TOKEN) { console.error('❌ BUFFER_TOKEN not set'); process.exit(1); }
  if (!ANTHROPIC_API_KEY) { console.error('❌ ANTHROPIC_API_KEY not set'); process.exit(1); }

  console.log('📣 Auto-poster starting...');

  const post = getLatestPost();
  if (!post) { console.error('❌ Could not read latest post'); process.exit(1); }
  console.log(`📰 Latest post: "${post.title}"`);

  console.log('✍️  Generating social copy...');
  const copy = await generateSocialCopy(post);
  console.log(`\nTwitter (${copy.twitter.length} chars):\n${copy.twitter}`);
  console.log(`\nLinkedIn:\n${copy.linkedin}`);

  console.log('\n📡 Fetching Buffer profiles...');
  const profiles = await getBufferProfiles();
  if (profiles.length === 0) { console.error('❌ No Buffer profiles found'); process.exit(1); }
  console.log(`Found ${profiles.length} profiles: ${profiles.map(p => `${p.service}(${p.name})`).join(', ')}`);

  let posted = 0;
  for (const profile of profiles) {
    const service = profile.service?.toLowerCase() || '';
    let text = '';

    if (service.includes('twitter') || service.includes('x')) {
      text = copy.twitter;
    } else if (service.includes('linkedin')) {
      text = copy.linkedin;
    } else if (service.includes('bluesky') || service.includes('mastodon')) {
      text = copy.twitter; // Use short version for other platforms
    } else {
      console.log(`⏭  Skipping unknown service: ${service}`);
      continue;
    }

    const success = await postToBuffer(profile.id, text, `${service}:${profile.name}`);
    if (success) posted++;
  }

  console.log(`\n✅ Done. Posted to ${posted}/${profiles.length} profiles.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
