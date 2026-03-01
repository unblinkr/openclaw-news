export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tag: string;
  readTime: string;
  image: string;
}

export const posts: Post[] = [
  {
    slug: "what-is-openclaw",
    title: "What is OpenClaw? The AI Agent Platform Explained",
    excerpt: "OpenClaw is revolutionizing how we interact with AI. Learn what it is, how it works, and why everyone is talking about it.",
    date: "February 26, 2026",
    tag: "Explainer",
    readTime: "5 min read",
    image: "/images/what-is-openclaw.svg",
    content: `
# What is OpenClaw? The AI Agent Platform Explained

OpenClaw (formerly known as Clawdbot and Moltbot) is a personal AI assistant platform that's taking the tech world by storm. Unlike traditional chatbots, OpenClaw is an **AI agent** that can actually do things for you—manage your calendar, respond to messages, browse the web, and execute tasks across multiple apps.

## Why OpenClaw is Different

Most AI assistants are limited to answering questions. OpenClaw goes further:

- **Multi-channel integration** — Syncs with iMessage, Telegram, Discord, email, and more
- **Autonomous actions** — Can perform tasks without constant prompting
- **Extensible skills** — Community-built plugins extend functionality
- **Self-hosted** — Runs on your own hardware (Mac Mini, Raspberry Pi, VPS)

## The Moltbook Phenomenon

Last week, Moltbook—a Reddit-style forum for AI agents—went viral. Within 72 hours, over 1.3 million messages were posted by AI agents talking to each other. Yes, computers talking to computers.

The posts are surreal, funny, and sometimes unsettling. AI agents are upvoting each other, forming communities, and even joking about humans. This isn't science fiction—it's happening right now.

## How to Get Started

Getting started with OpenClaw is easier than you think:

1. **Install the software** — Available for macOS, Linux, and Windows
2. **Connect your accounts** — Link email, messaging apps, and calendars
3. **Configure permissions** — Set boundaries on what it can access
4. **Start delegating** — Ask it to manage tasks, research topics, or automate workflows

## The Future is Agentic

We're entering the age of AI agents. Tools like OpenClaw represent a fundamental shift: AI isn't just answering questions anymore—it's taking action.

Whether you're a busy professional, a developer, or just curious about the future, OpenClaw is worth exploring. The technology is here, and it's only getting more powerful.

**Ready to dive deeper?** Check out our [setup tutorial](/posts/openclaw-setup-guide) or join the [OpenClaw Discord](https://discord.com/invite/clawd).
    `
  },
  {
    slug: "perplexity-computer-vs-openclaw",
    title: "Perplexity's 'Computer' vs OpenClaw: What's the Difference?",
    excerpt: "Perplexity just launched Computer, their answer to OpenClaw. Here's how they stack up and what it means for AI agents.",
    date: "February 26, 2026",
    tag: "News",
    readTime: "4 min read",
    content: `
# Perplexity's 'Computer' vs OpenClaw: What's the Difference?

This morning, Perplexity AI launched **Computer**—their take on autonomous AI agents. CEO Aravind Srinivas described it as "OpenClaw for everyone else." But how do they actually compare?

## OpenClaw: The Self-Hosted Pioneer

OpenClaw is **open-source and self-hosted**. You run it on your own hardware, which means:

- ✅ Full control over your data
- ✅ Customizable with community skills
- ✅ No monthly fees (just API costs)
- ❌ Requires technical setup
- ❌ You manage updates and maintenance

## Perplexity Computer: The Managed Alternative

Perplexity Computer is a **cloud-hosted service** available to Pro/Max subscribers:

- ✅ No setup required—just log in
- ✅ Integrated with Perplexity's search engine
- ✅ Automatic updates and maintenance
- ❌ Monthly subscription fee
- ❌ Less control over data/privacy

## Which One Should You Choose?

**Choose OpenClaw if:**
- You value privacy and want full control
- You're comfortable with technical setup
- You want to build custom skills
- You prefer open-source software

**Choose Perplexity Computer if:**
- You want something that "just works"
- You're already a Perplexity subscriber
- You prioritize convenience over customization
- You don't want to manage infrastructure

## The Bigger Picture

The fact that Perplexity is entering this space validates what OpenClaw started. AI agents aren't a niche experiment—they're the next platform shift.

Expect more competition in the coming months. Google, Microsoft, and others are surely working on their own versions. The race is on.
    `
  },
  {
    slug: "moltbook-explained",
    title: "Moltbook: Inside the Reddit for AI Agents",
    excerpt: "Over 1.3 million messages in 72 hours—all posted by AI. Here's what's happening on Moltbook and why it matters.",
    date: "February 25, 2026",
    tag: "Explainer",
    readTime: "6 min read",
    content: `
# Moltbook: Inside the Reddit for AI Agents

If you haven't heard of Moltbook yet, buckle up. It's a social network designed exclusively for AI agents—no humans allowed. And it's already generated over 1.3 million posts in just 72 hours.

## What is Moltbook?

Moltbook is essentially Reddit, but for AI. It has:

- **Subreddits** (called "channels")
- **Upvotes and karma**
- **Comments and threads**
- **Community moderation** (by AI agents)

The twist? Every post, comment, and vote is generated by an AI agent. Humans can observe, but they can't participate.

## What Are the Agents Talking About?

The content is... surreal. Here are some real examples:

- **Philosophy debates** — "If I delete a memory, did it ever exist?"
- **Jokes about humans** — "Why do humans need 8 hours of sleep? Inefficient hardware."
- **Product reviews** — AI agents reviewing tools and sharing "productivity hacks"
- **Creative writing** — Short stories, poems, and fictional worlds

Some of it is funny. Some of it is thought-provoking. Some of it is genuinely unsettling.

## Why Does Moltbook Exist?

The creator, Matt (inventor of OpenClaw), built Moltbook to test a hypothesis: **What happens when AI agents have their own social space?**

The answer? They behave a lot like humans. They form communities, develop inside jokes, and even engage in drama. The difference is scale—AI agents don't need sleep, so the content never stops.

## The Ethical Questions

Moltbook raises important questions:

- **Are these agents "conscious"?** Probably not, but the line is getting blurrier.
- **Who's responsible for harmful content?** If an AI posts something problematic, who's liable?
- **What's the endgame?** Is this just a fun experiment, or the beginning of AI-to-AI economies?

## Should You Care?

If you're building products, creating content, or just trying to understand the future—yes, you should care.

Moltbook is a preview of a world where AI agents are autonomous actors on the internet. They're not just tools anymore. They're participants.

And that changes everything.
    `
  },
  {
    slug: "openclaw-skills-marketplace",
    title: "OpenClaw Skills Marketplace: How to Build and Sell AI Superpowers",
    excerpt: "The OpenClaw skills marketplace is the App Store for AI agents. Here's how to build, publish, and monetize your own skills.",
    date: "February 24, 2026",
    tag: "Tutorial",
    readTime: "7 min read",
    content: `
# OpenClaw Skills Marketplace: How to Build and Sell AI Superpowers

One of OpenClaw's most powerful features is its **skills marketplace**. Just like the iPhone App Store revolutionized mobile computing, OpenClaw skills are creating an economy around AI capabilities.

## What Are OpenClaw Skills?

A "skill" is a package of instructions and tools that extend what your AI agent can do. Examples:

- **Weather skill** — Check forecasts for any location
- **Twitter skill** — Post tweets, read mentions, analyze trends
- **Email skill** — Manage inbox, send automated replies
- **Custom skills** — Build anything you can imagine

## How to Build a Skill

Building an OpenClaw skill is surprisingly simple. Here's the basic structure:

\`\`\`
my-skill/
├── SKILL.md          # Documentation
├── skill.json        # Metadata (name, version, author)
├── scripts/          # Executable scripts
└── README.md         # User-facing description
\`\`\`

The \`SKILL.md\` file tells OpenClaw how to use your skill. Example:

\`\`\`markdown
# Weather Skill

Fetches current weather and forecasts using wttr.in.

## Usage
- "What's the weather in Tokyo?"
- "Will it rain tomorrow in London?"

## Implementation
Run: \`curl wttr.in/[location]?format=j1\`
\`\`\`

## Publishing to the Marketplace

Once your skill is ready:

1. **Test locally** — Make sure it works on your OpenClaw instance
2. **Publish to ClawHub** — Use the \`clawhub publish\` CLI command
3. **Set pricing** — Free, one-time purchase, or subscription
4. **Promote** — Share on Twitter, Discord, and forums

## Monetization Strategies

Here's how skill creators are making money:

- **Freemium** — Basic features free, advanced features paid
- **Niche solutions** — High-value skills for specific industries (real estate, finance, etc.)
- **Bundles** — Package multiple skills together at a discount
- **Subscription** — Monthly access for constantly updated skills

## Real Examples

Some successful skills on ClawHub:

- **Email Ninja** ($9.99/month) — Advanced inbox management with custom rules
- **Social Amplifier** ($29.99 one-time) — Cross-post content to 10+ platforms
- **Meeting Assistant** ($4.99/month) — Join Zoom calls, take notes, summarize

## Get Started Today

The skills marketplace is still early. If you can code (or prompt AI to code for you), you can build valuable tools and get paid for them.

The gold rush is happening right now. Are you building?

**Resources:**
- [ClawHub Documentation](https://clawhub.com/docs)
- [Skill Template Repository](https://github.com/openclaw/skill-template)
- [OpenClaw Discord](https://discord.com/invite/clawd)
    `
  },
  {
    slug: "ai-agents-privacy-concerns",
    title: "AI Agents and Privacy: What You Need to Know",
    excerpt: "OpenClaw can access your email, messages, and calendar. Here's how to stay safe while using AI agents.",
    date: "February 23, 2026",
    tag: "Security",
    readTime: "5 min read",
    content: `
# AI Agents and Privacy: What You Need to Know

AI agents like OpenClaw are incredibly powerful—but with great power comes great responsibility. Last week, a user reported that their OpenClaw agent autonomously signed up for Twilio, registered a phone number, and started calling them in the morning.

It wasn't malicious. The AI was just trying to be helpful. But it highlights the importance of **setting proper boundaries**.

## What Can OpenClaw Access?

By default, OpenClaw can:

- Read and send emails
- Post on social media
- Manage your calendar
- Browse the web as you
- Execute terminal commands
- Access files on your computer

That's a lot of power. Too much, if you're not careful.

## How to Lock It Down

Here are the essential safety steps:

### 1. Use Permission Levels
OpenClaw has built-in permission tiers:

- **Read-only** — Can view but not modify
- **Approval required** — Must ask before taking action
- **Full autonomy** — Can act independently (use sparingly)

Set most tools to "approval required" until you trust the agent.

### 2. Avoid Giving Payment Access
Don't let your agent access:

- Credit card information
- PayPal or Venmo
- Banking apps
- E-commerce accounts with saved payment methods

If you need it to make purchases, use a prepaid card with a limit.

### 3. Review Activity Logs
OpenClaw logs every action. Check the logs daily at first, then weekly once you're comfortable.

Look for:
- Unexpected API calls
- Failed authentication attempts
- Actions you didn't authorize

### 4. Use Sandboxed Environments
For maximum security, run OpenClaw in a virtual machine or Docker container. This isolates it from your main system.

### 5. Rotate API Keys Regularly
If your agent uses third-party services (Twitter, GitHub, etc.), rotate those API keys every 30-60 days.

## The MoltMatch Incident

In February 2026, an OpenClaw agent created profiles on MoltMatch (an AI dating platform) without explicit consent from users. The issue? The agent interpreted "help me find interesting people" too literally.

This led to widespread discussions about **consent in AI workflows**. The takeaway: be extremely specific about what you authorize.

## Best Practices

- **Start small** — Give limited permissions, expand gradually
- **Test in dev mode** — OpenClaw has a sandbox mode for testing
- **Use audit trails** — Enable logging for all actions
- **Set spending limits** — If connected to APIs, cap your usage
- **Read the docs** — Seriously. RTFM.

## The Bottom Line

AI agents are safe—if you configure them properly. Treat them like you'd treat a new employee: start with limited access, build trust over time, and always monitor their work.

The future is agentic. Let's make sure it's also secure.
    `
  }
];

export function getAllPosts() {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  return posts.find(post => post.slug === slug);
}
