import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Tier = "hero" | "storyboard" | "concept";

export interface Card {
  slug: string;
  title: string;
  industry: string;
  persona: string;
  summary: string;
  tier: Tier;
  status_label: string;
  capability: string;
  mpc_primitives: string[];
  external_url?: string;
  demo_route?: string;
  architecture_note: string;
  before_state: string;
  after_state: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "cards");

export function getAllCards(): Card[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        industry: data.industry,
        persona: data.persona,
        summary: data.summary,
        tier: data.tier as Tier,
        status_label: data.status_label,
        capability: data.capability,
        mpc_primitives: data.mpc_primitives || [],
        external_url: data.external_url,
        demo_route: data.demo_route,
        architecture_note: data.architecture_note,
        before_state: data.before_state,
        after_state: data.after_state,
        content,
      };
    })
    .sort((a, b) => {
      const order: Record<Tier, number> = { hero: 0, storyboard: 1, concept: 2 };
      if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier];
      return a.title.localeCompare(b.title);
    });
}

export function getCardBySlug(slug: string): Card | undefined {
  return getAllCards().find((c) => c.slug === slug);
}

export function getIndustries(cards: Card[]): string[] {
  return Array.from(new Set(cards.map((c) => c.industry))).sort();
}
