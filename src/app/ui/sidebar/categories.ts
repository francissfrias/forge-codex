import { items } from 'dotaconstants';
import type { CategoryDef, ItemEntry, RawItem } from './types';

// ─── Category definitions (Dota 2 UI order) ────────────────────────────────

export const SHOP_CATEGORIES: CategoryDef[] = [
  {
    id: 'consumables',
    label: 'Consumables',
    color: '#1D80E7',
    match: (i) => !i.tier && (i.qual?.startsWith('consumable') ?? false),
  },
  {
    id: 'attributes',
    label: 'Attributes',
    color: '#A89070',
    match: (i) => !i.tier && i.qual === 'component',
  },
  {
    id: 'common',
    label: 'Common',
    color: '#2BAB01',
    match: (i) => !i.tier && i.qual === 'common',
  },
  {
    id: 'rare',
    label: 'Rare',
    color: '#1A87F9',
    match: (i) => !i.tier && i.qual === 'rare',
  },
  {
    id: 'epic',
    label: 'Epic',
    color: '#B812F9',
    match: (i) => !i.tier && i.qual === 'epic',
  },
  {
    id: 'artifact',
    label: 'Artifact',
    color: '#E29B01',
    match: (i) => !i.tier && i.qual === 'artifact',
  },
  {
    id: 'secret_shop',
    label: 'Secret Shop',
    color: '#c9a227',
    match: (i) => !i.tier && i.qual === 'secret_shop',
  },
];

export const NEUTRAL_CATEGORIES: CategoryDef[] = [
  {
    id: 'tier1',
    label: 'Neutral — Tier 1',
    color: '#8c9e88',
    match: (i) => i.tier === 1,
  },
  {
    id: 'tier2',
    label: 'Neutral — Tier 2',
    color: '#5ba3d9',
    match: (i) => i.tier === 2,
  },
  {
    id: 'tier3',
    label: 'Neutral — Tier 3',
    color: '#c47eff',
    match: (i) => i.tier === 3,
  },
  {
    id: 'tier4',
    label: 'Neutral — Tier 4',
    color: '#ff9a3c',
    match: (i) => i.tier === 4,
  },
  {
    id: 'tier5',
    label: 'Neutral — Tier 5',
    color: '#ff4f4f',
    match: (i) => i.tier === 5,
  },
];

export const ALL_CATEGORIES: CategoryDef[] = [
  ...SHOP_CATEGORIES,
  ...NEUTRAL_CATEGORIES,
];

// ─── Static data (computed once at module level) ─────────────────────────────

export const ALL_ITEMS: ItemEntry[] = Object.entries(
  items as unknown as Record<string, RawItem>
)
  .filter(([, item]) => Boolean(item.img))
  .map(([key, item]) => ({ key, item }));

export function getEntriesFor(catId: string): ItemEntry[] {
  const def = ALL_CATEGORIES.find((c) => c.id === catId);
  if (!def) return [];
  return ALL_ITEMS.filter((e) => def.match(e.item));
}

export function countFor(catId: string): number {
  return getEntriesFor(catId).length;
}
