import { randomBytes } from 'crypto'

const key = () => randomBytes(4).toString('hex')

// Helper: plain span
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks })

// Helper: block
const block = (children, style = 'normal', listItem = undefined, level = undefined) => {
  const b = { _type: 'block', _key: key(), style, markDefs: [], children }
  if (listItem) b.listItem = listItem
  if (level != null) b.level = level
  return b
}

const h2 = (text) => block([span(text)], 'h2')
const p = (...spans) => block(spans, 'normal')
const bullet = (text) => block([span(text)], 'normal', 'bullet', 1)
const s = (text) => span(text) // plain span alias
const bold = (text) => span(text, ['strong'])
const em = (text) => span(text, ['em'])

const articleContent = [
  // Introduction
  p(s("There's a lot of noise right now about AI replacing software engineers. I want to offer a different perspective — one that comes from actually building with it, not theorising about it.")),
  p(s("AI is not going to replace software engineers. But it will absolutely separate the ones who know how to use it from the ones who don't. The difference isn't about who can write the best prompt. It's about craft, structure, and intentionality at every stage of the process.")),
  p(s('When people talk about AI doing ‘80% of the work,” they’re not entirely wrong — but they’re usually measuring the wrong thing. Yes, AI can generate a lot of code quickly. But that 80% is the scaffolding, the obvious parts, the patterns. The remaining 20% is where the real engineering happens: refinement, integration, architectural decisions, handling edge cases, and making sure the output actually reflects your project’s principles. Skip that 20% and you end up with code that technically works but gradually becomes unmaintainable.')),
  p(s("I needed to test this myself. I needed a portfolio, and I was building it on the side of my everyday work — side projects have a particular rhythm: you get maybe a few days of momentum, then life happens and you get nothing for weeks. Traditional development is patience-heavy. You need consistent, unbroken context to stay productive. AI is different. It doesn't care if you haven't touched the project in three weeks. You can jump back in, hand off a chunk of work, and come back to working code.")),
  p(s("But more importantly, I wasn’t interested in reading hot takes about whether AI changes development. I wanted to run my own experiment. I needed to feel, in practice, where AI genuinely helps and where it falls short. Building a real project was the only way to find out.")),
  p(s("Here’s what I learned.")),

  // Principle 1
  h2("Principle 1: Plan, Plan, Plan"),
  p(s("The biggest mistake I see people make with AI is treating it like a vending machine. You put a requirement in, you expect working code out. That might work for something trivial. As soon as complexity enters the picture — real business logic, multiple systems, non-trivial UI — that approach falls apart fast.")),
  p(s("The shift that made everything click for me was entering "), bold("plan mode first"), s(". Before writing a single line of code, I used the AI agent as a thinking partner. We collected requirements, brainstormed approaches, evaluated trade-offs, and mapped out architectural decisions. Only then did we execute.")),
  p(s("This is where AI genuinely shines. Discovery and evaluation tasks that used to take a developer significant time and effort — researching patterns, weighing options, stress-testing an approach — can now happen in a fraction of the time. The planning phase is where you get the most leverage. Skipping it is where things go wrong.")),
  p(s("The difference between someone who gets great results with AI and someone who doesn’t often comes down to this single habit. Spend 30 minutes planning. Then 30 minutes building. The time ratio feels wrong to people who are used to “just starting” — but the output quality is night and day.")),

  // Principle 2
  h2("Principle 2: Match the Reasoning Level to the Task"),
  p(s("Not every task deserves the same cognitive horsepower. Being deliberate about this is something most people don’t think about — but it matters profoundly.")),
  p(s("A minor UI fix — like adjusting a button’s padding or tweaking a color — doesn’t need extended reasoning. Feed it to Claude with minimal context, get a working solution in seconds. A complex animation bug that touches multiple layers, has timing dependencies, and needs to feel smooth across different devices? That requires actual depth of reasoning. You need the AI to think through the problem space, consider trade-offs, maybe suggest multiple approaches.")),
  p(s("During my portfolio build I ran into exactly this. Early on, I had a straightforward issue where a component’s padding didn’t match the design system. I threw it at Claude with basic context — took maybe a minute to fix. Later, I hit a genuinely complicated animation bug where scroll events were triggering transforms in ways that caused jank on certain browsers. That one needed me to engage with deeper reasoning, provide more context, maybe iterate a few times.")),
  p(s("The way you approach them with AI should be fundamentally different. For the simple stuff, you want speed and minimal overhead. For the complex stuff, you want depth and rigor. Modern reasoning models actually support this now — you can dial the reasoning level up or down based on what the task actually needs.")),
  p(s("Think of it like choosing the right tool for the job. Throwing maximum reasoning at a simple task wastes time and money. Under-powering a complex one gives you shallow, incomplete solutions that look fine at first but break under real-world conditions.")),

  // Principle 3
  h2("Principle 3: Use MD Files to Drive Consistency"),
  p(s("One of the real challenges with AI-generated code is consistency. Left to its own devices, an agent might solve the same problem three different ways across three different sessions. That’s a problem when you’re trying to maintain a coherent codebase with clear architectural principles.")),
  p(s("The solution I found was markdown files — specifically CLAUDE.md. Claude reads these files before executing any task. That means you can define your architectural principles, coding conventions, and project-specific patterns once — and have them respected consistently.")),
  p(s("Here’s what mine looked like (simplified):")),
  // Code block rendered as bullet list since no code type in schema
  bullet("# CLAUDE.md - Portfolio Project Guidelines"),
  bullet("## Architecture"),
  bullet("- Use Tailwind for all styling, no CSS modules"),
  bullet("- Prefer functional components with hooks"),
  bullet("- Keep components under 300 lines; split if longer"),
  bullet("- Use Next.js server components for data fetching"),
  bullet("## Code Standards"),
  bullet("- Import order: React/external → relative imports → types"),
  bullet("- Use TypeScript strict mode"),
  bullet("- All API routes should validate input with Zod"),
  bullet("- Error boundaries on every major page"),
  bullet("## Design System"),
  bullet("- Colors: Reference design.tokens.json for all values"),
  bullet("- Spacing: Use multiples of 4px"),
  bullet("- Animations: Prefer CSS transitions over JS for performance"),
  bullet("- Mobile first: Design for mobile, enhance for desktop"),
  p(s("This isn’t just documentation. Claude actually reads this before every task. It means consistency isn’t something you have to argue for or manually enforce — it’s baked in from the start. Without these files, you’re essentially starting from scratch conceptually every time. With them, the agent has a clear mental model of how your project works.")),
  p(s("This isn’t primarily about saving tokens, though that’s a benefit. It’s about "), bold("output consistency"), s(". Your MD files become the guardrails your agent operates within.")),

  // Principle 4
  h2("Principle 4: Choose an AI-Friendly Tech Stack"),
  p(s("This one is underrated and undertalked about. Not all technologies are equal when it comes to working with AI agents, and part of levelling up as an AI-powered developer is making deliberate stack choices that play to AI’s strengths.")),
  p(s("For my portfolio I chose "), bold("Tailwind CSS"), s(" over plain CSS or SASS. AI interprets and generates Tailwind far more reliably because it’s a predefined set of utility classes — AI doesn’t have to invent CSS, it just has to pick from known options. It’s also the standard in tools like Figma, which creates a natural design-to-code pipeline.")),
  p(s("I chose "), bold("Sanity"), s(" as my CMS because it’s explicitly built with AI in mind. Sanity stores content as structured data, not HTML. That means when an AI agent queries it, it gets clean, semantically rich information that it can actually reason about. Compare that to scraping a website or working with unstructured content — the AI literally has an easier time understanding what it’s working with.")),
  p(s("And I built on "), bold("Next.js"), s(" because it now ships with MCP (Model Context Protocol) support built in. This means AI coding agents can actually see your running application, understand your routing structure, and access live application state. The DevTools MCP server gives agents direct insight into errors, performance issues, and the current state of your app.")),
  p(s("The pattern here is that the modern tooling ecosystem is converging around AI. These aren’t neutral tools — they’re explicitly designed to be AI-friendly. Choosing them gives you compounding benefits across your entire workflow.")),

  // Principle 5
  h2("Principle 5: Your Figma Setup is a Force Multiplier"),
  p(s("Here’s something that surprised me: the quality of your AI output is directly tied to the quality of your inputs — and that includes your design files.")),
  p(s("If your Figma is set up properly, something almost magical happens. With auto layout, design tokens, proper component structures, style kits, and consistent use of flex and grid principles — then passing it through Claude becomes almost frictionless. The gap between design and working code nearly disappears.")),
  p(s("Here’s the concrete difference: With a poorly structured Figma file, I’d get code that technically rendered the design but didn’t respect the underlying structure. Components weren’t reusable, spacing was hardcoded, and the code couldn’t adapt to changes. With a well-structured file using design tokens and auto layout, Claude generated code that mapped directly to my actual component library and design system.")),
  p(s("In practice, this meant almost no manual developer work in the translation layer. Which is where that much-used “10x productivity” claim actually becomes real — not from AI writing more code, but from eliminating manual work between design and implementation.")),
  p(s("The deeper insight is this: "), bold("AI follows the guardrails you set upstream."), s(" A well-structured Figma file is a set of guardrails. So is a well-written MD file. So is a good plan. The better your existing practices and tooling, the better your AI output. The engineer’s craft still matters enormously — it just shows up in different places than it used to.")),

  // Closing Thoughts
  h2("Closing Thoughts"),
  p(s("AI is a genuine force multiplier for software engineers. But it rewards preparation, structure, and intentionality. It doesn’t reward laziness or shortcuts — at least not beyond the most trivial tasks.")),
  p(s("The engineers who will thrive with this technology aren’t the ones who offload their thinking to it. They’re the ones who bring sharper thinking to it — better plans, better structures, better inputs. The craft hasn’t gone away. It’s just moved upstream.")),
  p(s("The real opportunity isn’t in writing less code. It’s in making every decision more intentional — knowing exactly what you want, structuring your tools to support it, and letting AI handle the rest.")),
]

const document = {
  _type: 'articlePage',
  title: "I Built a Portfolio With AI. Here’s What Actually Worked.",
  slug: {
    _type: 'slug',
    current: 'journals/i-built-a-portfolio-with-ai-heres-what-actually-worked',
  },
  tags: ['AI', 'Development', 'Engineering', 'Next.js', 'Tailwind CSS', 'Sanity', 'Figma', 'Productivity'],
  articleContent,
}

const mutation = {
  mutations: [{ create: document }],
}

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(mutation),
})

const result = await response.json()
console.log(JSON.stringify(result, null, 2))
