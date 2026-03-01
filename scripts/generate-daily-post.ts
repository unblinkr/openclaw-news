#!/usr/bin/env node
/**
 * Daily News Generator Script
 * Run this daily to pull trending news and create a new post
 *
 * Usage:
 *   ts-node scripts/generate-daily-post.ts
 *   # or with bun/node:
 *   npx ts-node scripts/generate-daily-post.ts
 */

import { fetchTrendingNews, generateOriginalTake, convertToPost } from '../src/lib/news.js';
import * as fs from 'fs';
import * as path from 'path';

async function generateDailyPost() {
  console.log('🤖 Fetching trending AI agent news...');

  // Fetch top stories
  const articles = await fetchTrendingNews();

  if (articles.length === 0) {
    console.log('No news articles found today.');
    return;
  }

  // Pick the most relevant AI agent story (skip API key warnings)
  const relevantArticle = articles.find(a =>
    !a.title.includes('API Key') &&
    (a.title.toLowerCase().includes('ai') ||
     a.title.toLowerCase().includes('agent') ||
     a.title.toLowerCase().includes('automation') ||
     a.title.toLowerCase().includes('claude'))
  ) || articles[0];

  if (!relevantArticle) {
    console.log('No relevant AI articles found today.');
    return;
  }

  console.log(`\n📰 Selected: ${relevantArticle.title}`);
  console.log(`   Source: ${relevantArticle.source}`);

  // Generate original take
  console.log('\n✍️  Generating original analysis...');
  const take = generateOriginalTake(relevantArticle);

  // Create slug from title
  const slug = take.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  // Convert to post
  const post = convertToPost(take, relevantArticle, slug);

  // Read existing posts file
  const postsPath = path.join(process.cwd(), 'src', 'lib', 'posts.ts');
  let postsContent = fs.readFileSync(postsPath, 'utf-8');

  // Create new post entry
  const newPostEntry = `{
    slug: "${post.slug}",
    title: "${post.title.replace(/"/g, '\\"')}",
    excerpt: "${post.excerpt.replace(/"/g, '\\"').substring(0, 150)}",
    content: \`
${post.content}
\`,
    date: "${post.date}",
    tag: "News",
    readTime: "4 min read",
  },`;

  // Insert after the opening bracket of posts array
  const arrayStart = postsContent.indexOf('export const posts: Post[] = [');
  if (arrayStart === -1) {
    console.error('Could not find posts array in posts.ts');
    return;
  }

  const insertPosition = postsContent.indexOf('{', arrayStart);
  const updatedContent =
    postsContent.slice(0, insertPosition) +
    newPostEntry + '\n  ' +
    postsContent.slice(insertPosition);

  // Write updated file
  fs.writeFileSync(postsPath, updatedContent);

  console.log(`\n✅ New post created: ${post.slug}`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Date: ${post.date}`);
  console.log(`\n📌 Next steps:`);
  console.log(`   1. Review the generated post in src/lib/posts.ts`);
  console.log(`   2. Edit the content to add your specific insights`);
  console.log(`   3. Run 'npm run build' to rebuild the site`);
  console.log(`   4. 'git add -A && git commit -m "Add daily news" && git push'`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDailyPost().catch(console.error);
}

export { generateDailyPost };
