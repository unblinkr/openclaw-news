#!/usr/bin/env node
/**
 * Daily News Generator - Powered by Claude AI
 * Runs daily via GitHub Actions to generate a fresh AI agent news post
 * Requires: ANTHROPIC_API_KEY env var
 */

import * as fs from 'fs';
import * as path from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const TOPIC_PROMPTS = [
  "a major AI agent platform update or product launch that happened recently",
  "how builders and indie hackers are using AI agents to replace traditional SaaS workflows",
  "the latest developments in autonomous AI systems and what they mean for knowledge workers",
  "a trend in the AI agent ecosystem: tooling, infrastructure, or deployment patterns",
  "the business model evolution of AI agent companies — how they're monetizing in 2026",
  "how agentic AI is changing specific industries: legal, finance, ecommerce, or content",
  "the state of AI agent reliability — what's getting better, what still breaks",
  "new open source AI agent frameworks and what makes them worth watching",
];

function getTodaysTopic(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return TOPIC_PROMPTS[dayOfYear % TOPIC_PROMPTS.length];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 55)
    .replace(/-$/, '');
}

async function generateArticleWithClaude(topic: string) {
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `You are the lead writer for OpenClaw News — the authoritative publication covering AI agents, autonomous systems, and the builder economy. Today is ${today}.

Write a sharp, original news analysis article about: ${topic}

The article should be 400-500 words of real analysis, have a punchy headline, cover what's happening and why it matters for builders. Sound like a sharp tech journalist who builds things themselves. Never name specific private individuals.

Return ONLY a JSON object, no markdown, no backticks:
{"title":"headline","excerpt":"1-2 sentence summary max 160 chars","tag":"News or Analysis or Deep Dive or Opinion","readTime":"X min read","content":"full article in markdown with ## section headers"}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    console.error(`Anthropic API error: ${res.status}`);
    return null;
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error('Failed to parse response:', e);
    return null;
  }
}

async function generateDailyPost() {
  console.log('OpenClaw News Daily Generator starting...');

  const topic = getTodaysTopic();
  console.log(`Topic: ${topic}`);

  const article = await generateArticleWithClaude(topic);
  if (!article) { process.exit(1); }

  const slug = slugify(article.title);
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  console.log(`Generated: "${article.title}" -> ${slug}`);

  const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
  const postsContent = fs.readFileSync(postsPath, 'utf-8');

  if (postsContent.includes(`slug: "${slug}"`)) {
    console.log(`Slug "${slug}" already exists — skipping.`);
    return;
  }

  const safeContent = article.content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const safeTitle = article.title.replace(/"/g, '\\"');
  const safeExcerpt = article.excerpt.replace(/"/g, '\\"').substring(0, 160);

  const newPostEntry = `{
    slug: "${slug}",
    title: "${safeTitle}",
    excerpt: "${safeExcerpt}",
    content: \`
${safeContent}
\`,
    date: "${date}",
    tag: "${article.tag}",
    readTime: "${article.readTime}",
  },`;

  const arrayStart = postsContent.indexOf('export const posts: Post[] = [');
  const insertPosition = postsContent.indexOf('{', arrayStart);
  const updatedContent = postsContent.slice(0, insertPosition) + newPostEntry + '\n  ' + postsContent.slice(insertPosition);

  fs.writeFileSync(postsPath, updatedContent);
  console.log(`Done. Post "${article.title}" added for ${date}`);
}

generateDailyPost().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
