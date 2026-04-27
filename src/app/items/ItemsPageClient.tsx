'use client';

import { items } from 'dotaconstants';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CDN = 'https://cdn.dota2.com';
const TOOLTIP_W = 288; // px — matches w-72

// ─── Types ───────────────────────────────────────────────────────────────────

type ItemAbility = {
  type: string;
  title: string;
  description: string;
};

type ItemAttrib = {
  key: string;
  value: string;
  display?: string;
};

type RawItem = {
  id: number;
  dname: string;
  qual?: string;
  cost: number;
  img: string;
  tier?: number;
  abilities?: ItemAbility[];
  attrib?: ItemAttrib[];
  mc?: number | false;
  hc?: number | false;
  cd?: number | false;
  lore?: string;
  notes?: string;
  behavior?: string | string[] | false;
  components?: string[] | null;
  created?: boolean;
  charges?: number | false;
  bkbpierce?: string;
  dmg_type?: string;
};

type ItemEntry = { key: string; item: RawItem };

type TabDef = {
  id: string;
  label: string;
  color: string;
  match: (item: RawItem) => boolean;
};

type RecipeTreeNode = {
  key: string;
  item: RawItem | null;
  isRecipe: boolean;
  children: RecipeTreeNode[];
};

// ─── Category / tab definitions ──────────────────────────────────────────────

const ALL_TABS: TabDef[] = [
  { id: 'all', label: 'All Items', color: '#e8dcc8', match: () => true },
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
  {
    id: 'tier1',
    label: 'Neutral T1',
    color: '#8c9e88',
    match: (i) => i.tier === 1,
  },
  {
    id: 'tier2',
    label: 'Neutral T2',
    color: '#5ba3d9',
    match: (i) => i.tier === 2,
  },
  {
    id: 'tier3',
    label: 'Neutral T3',
    color: '#c47eff',
    match: (i) => i.tier === 3,
  },
  {
    id: 'tier4',
    label: 'Neutral T4',
    color: '#ff9a3c',
    match: (i) => i.tier === 4,
  },
  {
    id: 'tier5',
    label: 'Neutral T5',
    color: '#ff4f4f',
    match: (i) => i.tier === 5,
  },
];

// ─── Static data (computed once at module level) ──────────────────────────────

/** All items that have an image (includes recipe scrolls for recipe tree lookup). */
const ALL_ITEMS_MAP: Record<string, RawItem> = Object.fromEntries(
  Object.entries(items as unknown as Record<string, RawItem>).filter(
    ([, item]) => Boolean(item.img)
  )
);

/** Items displayed in the grid — recipe scrolls excluded. */
const GRID_ITEMS: ItemEntry[] = Object.entries(ALL_ITEMS_MAP)
  .filter(([key]) => !key.startsWith('recipe_'))
  .map(([key, item]) => ({ key, item }));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function keyToLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatAttrib(a: ItemAttrib): string {
  if (a.display) return a.display.replace('{value}', a.value);
  return `${keyToLabel(a.key)}: ${a.value}`;
}

function getBehaviors(item: RawItem): string[] {
  if (!item.behavior) return [];
  return Array.isArray(item.behavior) ? item.behavior : [item.behavior];
}

const QUAL_COLORS: Record<string, string> = {
  consumable: '#1D80E7',
  component: '#A89070',
  common: '#2BAB01',
  rare: '#1A87F9',
  epic: '#B812F9',
  artifact: '#E29B01',
  secret_shop: '#c9a227',
};

const TIER_COLORS: Record<number, string> = {
  1: '#8c9e88',
  2: '#5ba3d9',
  3: '#c47eff',
  4: '#ff9a3c',
  5: '#ff4f4f',
};

function getQualColor(item: RawItem): string {
  if (item.qual && QUAL_COLORS[item.qual]) return QUAL_COLORS[item.qual];
  if (item.tier && TIER_COLORS[item.tier]) return TIER_COLORS[item.tier];
  return '#e8dcc8';
}

// ─── Recipe tree builder ──────────────────────────────────────────────────────

function buildRecipeTree(
  key: string,
  depth = 0,
  visited: Set<string> = new Set()
): RecipeTreeNode {
  const isRecipe = key.startsWith('recipe_');
  const item = ALL_ITEMS_MAP[key] ?? null;

  if (depth >= 5 || visited.has(key)) {
    return { key, item, isRecipe, children: [] };
  }

  const nextVisited = new Set(visited).add(key);
  const children = (item?.components ?? []).map((c) =>
    buildRecipeTree(c, depth + 1, nextVisited)
  );

  return { key, item, isRecipe, children };
}

// ─── RecipeNode component ─────────────────────────────────────────────────────

function RecipeNode({
  node,
  depth = 0,
}: {
  node: RecipeTreeNode;
  depth?: number;
}) {
  const { item, isRecipe, children, key } = node;

  return (
    <div
      className={depth > 0 ? 'ml-5 border-l border-white/10 pl-3 mt-1.5' : ''}
    >
      <div
        className={`flex items-center gap-2.5 px-2 py-1.5 rounded ${
          isRecipe
            ? 'border border-dashed border-white/20 bg-white/2'
            : 'border border-white/10 bg-white/5'
        }`}
      >
        {item?.img ? (
          <div className='w-7 h-7 relative rounded overflow-hidden shrink-0 border border-white/10 bg-black/30'>
            <Image
              src={`${CDN}${item.img}`}
              alt={item.dname || keyToLabel(key)}
              fill
              sizes='28px'
              className='object-cover'
              unoptimized
            />
          </div>
        ) : (
          <div className='w-7 h-7 rounded border border-dashed border-white/20 bg-black/20 flex items-center justify-center shrink-0'>
            <span className='text-2xs text-white/30'>?</span>
          </div>
        )}

        <div className='flex-1 min-w-0'>
          <div className='text-xs text-dota-text-primary truncate'>
            {item?.dname ?? keyToLabel(key)}
          </div>
          {isRecipe && (
            <div className='text-2xs text-dota-text-muted'>Recipe scroll</div>
          )}
        </div>

        {item?.cost != null && item.cost > 0 && !isRecipe && (
          <div className='text-xs text-dota-text-gold font-mono shrink-0'>
            {item.cost}g
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div>
          {children.map((child) => (
            <RecipeNode key={child.key} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared item detail content ───────────────────────────────────────────────

function ItemDetail({
  item,
  compact = false,
}: {
  item: RawItem;
  compact?: boolean;
}) {
  const qualColor = getQualColor(item);
  const behaviors = getBehaviors(item);
  const xs = compact ? 'text-2xs' : 'text-xs';
  const sm = compact ? 'text-xs' : 'text-sm';

  return (
    <>
      {/* Behavior pills */}
      {behaviors.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {behaviors.map((b) => (
            <span
              key={b}
              className={`${xs} px-1.5 py-0.5 rounded bg-white/5 text-dota-text-muted border border-white/10`}
            >
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Attributes */}
      {item.attrib && item.attrib.length > 0 && (
        <div className='flex flex-col gap-1'>
          {item.attrib.map((a, idx) => (
            <div key={idx} className={`${xs} text-dota-text-secondary`}>
              {formatAttrib(a)}
            </div>
          ))}
        </div>
      )}

      {/* Abilities */}
      {item.abilities && item.abilities.length > 0 && (
        <div className='flex flex-col gap-2'>
          {item.abilities.map((ab, idx) => (
            <div
              key={idx}
              className={
                compact
                  ? ''
                  : 'bg-black/20 border border-white/5 rounded-lg p-3'
              }
            >
              <div className='flex items-baseline gap-1.5 mb-1'>
                <span
                  className={`${xs} uppercase tracking-wide text-dota-text-muted`}
                >
                  {ab.type}
                </span>
                <span
                  className={`${xs} font-semibold`}
                  style={{ color: qualColor }}
                >
                  {ab.title}
                </span>
              </div>
              <p
                className={`${xs} text-dota-text-secondary leading-relaxed whitespace-pre-line`}
              >
                {ab.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Cooldown / Mana / Charges */}
      {(item.cd || item.mc || item.charges) && (
        <div className='flex items-center gap-3'>
          {item.cd && (
            <span className={`${xs} text-dota-text-muted`}>
              ⏱{' '}
              <span className='text-dota-text-primary font-mono'>
                {item.cd}s
              </span>
            </span>
          )}
          {item.mc && (
            <span className={`${xs} text-dota-text-muted`}>
              💧{' '}
              <span className='text-dota-intelligence font-mono'>
                {item.mc}
              </span>
            </span>
          )}
          {item.charges && (
            <span className={`${xs} text-dota-text-muted`}>
              ⚡{' '}
              <span className='text-dota-text-primary font-mono'>
                {item.charges}
              </span>{' '}
              charges
            </span>
          )}
        </div>
      )}

      {/* Lore */}
      {item.lore && (
        <p className={`${sm} text-dota-text-gold italic leading-relaxed`}>
          {item.lore}
        </p>
      )}

      {/* Notes */}
      {item.notes && (
        <p className={`${xs} text-dota-text-muted leading-relaxed`}>
          {item.notes}
        </p>
      )}
    </>
  );
}

// ─── Hover tooltip ────────────────────────────────────────────────────────────

function ItemTooltip({
  entry,
  x,
  y,
}: {
  entry: ItemEntry;
  x: number;
  y: number;
}) {
  const { item } = entry;
  const qualColor = getQualColor(item);
  const OFFSET = 16;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1400;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  const left =
    x + OFFSET + TOOLTIP_W > vw ? x - OFFSET - TOOLTIP_W : x + OFFSET;
  const top = Math.max(8, Math.min(y - 20, vh - 420));

  return (
    <div
      className='fixed z-50 pointer-events-none select-none'
      style={{ left, top, width: TOOLTIP_W }}
    >
      <div className='bg-dota-bg-panel border border-dota-border rounded-lg overflow-hidden shadow-(--shadow-dota-panel)'>
        {/* Header */}
        <div className='flex items-center gap-2.5 px-3 py-2.5 border-b border-white/5 bg-[#1e1530]/60'>
          <div className='w-10 h-10 relative rounded overflow-hidden shrink-0 border border-white/10 bg-black/30'>
            <Image
              src={`${CDN}${item.img}`}
              alt={item.dname || keyToLabel(entry.key)}
              fill
              sizes='40px'
              className='object-cover'
              unoptimized
            />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-semibold text-dota-text-primary leading-tight'>
              {item.dname}
            </div>
            <div className='mt-0.5 flex items-center gap-1.5'>
              {item.qual && (
                <span
                  className='text-2xs font-semibold uppercase tracking-wide'
                  style={{ color: qualColor }}
                >
                  {item.qual.replace(/_/g, ' ')}
                </span>
              )}
              {item.tier && (
                <span
                  className='text-2xs font-semibold uppercase tracking-wide'
                  style={{ color: qualColor }}
                >
                  Neutral T{item.tier}
                </span>
              )}
            </div>
          </div>
          {item.cost > 0 && (
            <div className='text-sm font-bold text-dota-text-gold font-mono shrink-0'>
              {item.cost}g
            </div>
          )}
        </div>

        {/* Detail */}
        <div className='px-3 py-2.5 flex flex-col gap-2'>
          <ItemDetail item={item} compact />
        </div>

        {/* Click hint */}
        <div className='px-3 py-1.5 border-t border-white/5 text-center'>
          <span className='text-2xs text-white/25'>
            Click for full recipe detail
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────

function ItemModal({
  entry,
  onClose,
}: {
  entry: ItemEntry;
  onClose: () => void;
}) {
  const { key, item } = entry;
  const qualColor = getQualColor(item);
  const hasRecipe = item.components && item.components.length > 0;

  const componentNodes = (item.components ?? []).map((c) => buildRecipeTree(c));

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8'
      style={{
        backgroundColor: 'rgba(10,8,20,0.85)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className='relative bg-dota-bg-panel border border-dota-border rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-(--shadow-dota-card)'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className='flex items-center gap-3.5 px-5 py-4 border-b border-white/10 bg-[#1e1530]/60 shrink-0'>
          <div className='w-14 h-14 relative rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black/30'>
            <Image
              src={`${CDN}${item.img}`}
              alt={item.dname || keyToLabel(key)}
              fill
              sizes='56px'
              className='object-cover'
              unoptimized
            />
          </div>
          <div className='flex-1 min-w-0'>
            <h2 className='font-dota text-xl text-dota-text-primary tracking-wide leading-tight'>
              {item.dname}
            </h2>
            <div className='flex flex-wrap items-center gap-2 mt-1.5'>
              {item.qual && (
                <span
                  className='text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border'
                  style={{ color: qualColor, borderColor: qualColor + '40' }}
                >
                  {item.qual.replace(/_/g, ' ')}
                </span>
              )}
              {item.tier && (
                <span
                  className='text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border'
                  style={{ color: qualColor, borderColor: qualColor + '40' }}
                >
                  Neutral Tier {item.tier}
                </span>
              )}
              {item.cost > 0 && (
                <span className='text-sm font-bold text-dota-text-gold font-mono'>
                  {item.cost} Gold
                </span>
              )}
              {item.bkbpierce && (
                <span className='text-xs text-dota-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/10'>
                  BKB: {item.bkbpierce}
                </span>
              )}
              {item.dmg_type && (
                <span className='text-xs text-dota-text-muted bg-white/5 px-2 py-0.5 rounded border border-white/10'>
                  {item.dmg_type} dmg
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className='shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/80 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        {/* Modal body — two-column layout */}
        <div className='flex-1 min-h-0 overflow-hidden'>
          <div className='h-full grid grid-cols-1 md:grid-cols-2'>
            {/* Left: item detail */}
            <div className='overflow-y-auto scrollbar-dark p-5 flex flex-col gap-4 border-b border-white/10 md:border-b-0 md:border-r'>
              <ItemDetail item={item} compact={false} />
            </div>

            {/* Right: recipe tree */}
            <div className='overflow-y-auto scrollbar-dark p-5'>
              <div className='text-2xs uppercase tracking-widest text-dota-text-muted mb-3 font-semibold'>
                Recipe
              </div>
              {hasRecipe ? (
                <div className='flex flex-col gap-2'>
                  {componentNodes.map((node) => (
                    <RecipeNode key={node.key} node={node} depth={0} />
                  ))}
                </div>
              ) : (
                <p className='text-sm text-dota-text-muted italic'>
                  {item.created
                    ? 'No component data available.'
                    : 'Base item — purchased directly from the shop.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Item card (grid cell) ────────────────────────────────────────────────────

function ItemCard({
  entry,
  onHover,
  onLeave,
  onMove,
  onClick,
}: {
  entry: ItemEntry;
  onHover: (entry: ItemEntry, e: React.MouseEvent) => void;
  onLeave: () => void;
  onMove: (e: React.MouseEvent) => void;
  onClick: (entry: ItemEntry) => void;
}) {
  return (
    <button
      className='flex flex-col items-center gap-1 group cursor-pointer focus:outline-none'
      onMouseEnter={(e) => onHover(entry, e)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={() => onClick(entry)}
    >
      <div className='w-12 h-12 relative rounded overflow-hidden border border-white/5 bg-black/30 group-hover:border-[#d4970a]/60 transition-all duration-150'>
        <Image
          src={`${CDN}${entry.item.img}`}
          alt={entry.item.dname || keyToLabel(entry.key)}
          fill
          sizes='48px'
          className='object-cover'
          unoptimized
        />
      </div>
      <span className='text-2xs text-dota-text-muted text-center leading-tight w-14 line-clamp-2 group-hover:text-dota-text-secondary transition-colors'>
        {entry.item.dname}
      </span>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ItemsPageClient() {
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredEntry, setHoveredEntry] = useState<ItemEntry | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedEntry, setSelectedEntry] = useState<ItemEntry | null>(null);

  const tab = ALL_TABS.find((t) => t.id === activeTab) ?? ALL_TABS[0];
  const filteredItems = GRID_ITEMS.filter((e) => tab.match(e.item));

  const handleHover = (entry: ItemEntry, e: React.MouseEvent) => {
    setHoveredEntry(entry);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleLeave = () => setHoveredEntry(null);

  const handleClick = (entry: ItemEntry) => {
    setSelectedEntry(entry);
    setHoveredEntry(null);
  };

  const handleCloseModal = () => setSelectedEntry(null);

  const activeColor =
    ALL_TABS.find((t) => t.id === activeTab)?.color ?? '#e8dcc8';

  return (
    <div className='min-h-screen flex flex-col bg-dota-bg text-dota-text-primary'>
      {/* Top bar */}
      <header className='shrink-0 border-b border-white/5 bg-[#111319] px-6 py-3 flex items-center gap-4'>
        <Link
          href='/'
          className='text-sm text-dota-text-muted hover:text-dota-text-primary transition-colors flex items-center gap-1.5'
        >
          ← Builder
        </Link>
        <div className='w-px h-4 bg-white/10' />
        <h1 className='font-dota text-dota-gold text-xl uppercase tracking-wide'>
          Item Browser
        </h1>
        <span className='ml-auto text-sm text-dota-text-muted font-mono'>
          {filteredItems.length} items
        </span>
      </header>

      {/* Category tab bar */}
      <nav className='shrink-0 border-b border-white/5 bg-[#111319]/90 overflow-x-auto scrollbar-dark'>
        <div className='flex min-w-max px-4'>
          {ALL_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm whitespace-nowrap cursor-pointer focus:outline-none transition-colors ${
                  isActive
                    ? 'text-dota-text-primary'
                    : 'text-dota-text-muted hover:text-dota-text-secondary'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span
                    className='absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full'
                    style={{ backgroundColor: activeColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Item grid */}
      <main className='flex-1 overflow-y-auto scrollbar-dark p-6'>
        <div
          className='grid gap-x-3 gap-y-5'
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(3.5rem, 1fr))',
          }}
        >
          {filteredItems.map((entry) => (
            <ItemCard
              key={entry.key}
              entry={entry}
              onHover={handleHover}
              onLeave={handleLeave}
              onMove={handleMove}
              onClick={handleClick}
            />
          ))}
        </div>
      </main>

      {/* Hover tooltip — portal-style fixed overlay */}
      {hoveredEntry && (
        <ItemTooltip entry={hoveredEntry} x={tooltipPos.x} y={tooltipPos.y} />
      )}

      {/* Click modal */}
      {selectedEntry && (
        <ItemModal entry={selectedEntry} onClose={handleCloseModal} />
      )}
    </div>
  );
}
