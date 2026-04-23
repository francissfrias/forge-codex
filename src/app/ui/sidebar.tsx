'use client';

import { useReactFlow } from '@xyflow/react';
import { items } from 'dotaconstants';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDnD } from '../hooks/useDnd';
import { DragGhost } from './drag-ghost';

const CDN = 'https://cdn.cloudflare.steamstatic.com';

// ─── Types ─────────────────────────────────────────────────────────────────

type RawItem = {
  id: number;
  dname: string;
  qual?: string;
  cost: number;
  img: string;
  tier?: number;
  [key: string]: unknown;
};

type ItemEntry = { key: string; item: RawItem };

type CategoryDef = {
  id: string;
  label: string;
  color: string;
  match: (item: RawItem) => boolean;
};

// ─── Category definitions (Dota 2 UI order) ────────────────────────────────

const SHOP_CATEGORIES: CategoryDef[] = [
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

const NEUTRAL_CATEGORIES: CategoryDef[] = [
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

const ALL_CATEGORIES: CategoryDef[] = [
  ...SHOP_CATEGORIES,
  ...NEUTRAL_CATEGORIES,
];

// ─── Static data (computed once at module level) ─────────────────────────────

const ALL_ITEMS: ItemEntry[] = Object.entries(
  items as unknown as Record<string, RawItem>
)
  .filter(([, item]) => Boolean(item.img))
  .map(([key, item]) => ({ key, item }));

function getEntriesFor(catId: string): ItemEntry[] {
  const def = ALL_CATEGORIES.find((c) => c.id === catId);
  if (!def) return [];
  return ALL_ITEMS.filter((e) => def.match(e.item));
}

function countFor(catId: string): number {
  return getEntriesFor(catId).length;
}

// ─── ItemIcon ────────────────────────────────────────────────────────────────

let id = 0;
const getId = () => `dndnode_${id++}`;

function ItemIcon({ entry }: { entry: ItemEntry }) {
  const { onDragStart } = useDnD();
  const { setNodes } = useReactFlow();

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      console.log('[DnD] 1. pointerDown fired on item:', entry.key);
      onDragStart(
        e,
        ({ position }) => {
          console.log('[DnD] 3. drop action called! position:', position);
          setNodes((nds) =>
            nds.concat({
              id: getId(),
              type: 'itemNode',
              position,
              data: { key: entry.key, item: entry.item },
            })
          );
          console.log('[DnD] 4. node added to flow');
        },
        entry.item.img
      );
      console.log('[DnD] 2. onDragStart called — drop action registered');
    },
    [onDragStart, setNodes, entry]
  );

  return (
    <div
      className='flex flex-col items-center gap-0.5 cursor-grab'
      onPointerDown={handlePointerDown}
    >
      <div className='w-12 h-12 relative rounded overflow-hidden border border-white/5 bg-black/30 hover:border-dota-border-gold transition-colors duration-150'>
        <Image
          src={`${CDN}${entry.item.img}`}
          alt={entry.item.dname || entry.key}
          fill
          sizes='48px'
          className='object-cover'
          unoptimized
        />
      </div>
      <span className='text-2xs text-dota-text-muted text-center leading-tight w-12 truncate'>
        {entry.item.dname}
      </span>
    </div>
  );
}

// ─── ItemPanel (flyout) ───────────────────────────────────────────────────────

function ItemPanel({
  categoryId,
  label,
  color,
}: {
  categoryId: string;
  label: string;
  color: string;
}) {
  const entries = getEntriesFor(categoryId);

  return (
    <div className='w-72 h-full flex flex-col bg-[#0f0d18] border-r border-white/5'>
      {/* Panel header */}
      <div className='px-4 py-3 border-b border-white/5 shrink-0 flex items-center gap-2'>
        <span
          className='w-1.5 h-1.5 rounded-full shrink-0'
          style={{ backgroundColor: color }}
        />
        <span
          className='text-xs font-semibold uppercase tracking-widest'
          style={{ color }}
        >
          {label}
        </span>
        <span className='ml-auto text-2xs text-dota-text-muted font-mono'>
          {entries.length}
        </span>
      </div>

      {/* Item grid */}
      <div className='flex-1 overflow-y-auto scrollbar-dark px-3 py-3'>
        {entries.length === 0 ? (
          <p className='text-xs text-dota-text-muted italic px-1'>No items.</p>
        ) : (
          <div className='grid grid-cols-4 gap-1.5'>
            {entries.map((entry) => (
              <ItemIcon key={entry.key} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CategoryButton ───────────────────────────────────────────────────────────

function CategoryButton({
  def,
  count,
  isActive,
  onClick,
}: {
  def: CategoryDef;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer focus:outline-none transition-colors duration-100 ${
        isActive ? 'bg-white/5' : 'hover:bg-white/3'
      }`}
    >
      {/* Active left border accent */}
      <span
        className='absolute left-0 top-0 bottom-0 w-0.5 transition-opacity duration-150'
        style={{
          backgroundColor: def.color,
          opacity: isActive ? 1 : 0,
        }}
      />

      <span
        className={`text-sm flex-1 transition-colors duration-100 ${
          isActive ? 'text-dota-text-primary' : 'text-dota-text-muted'
        }`}
        style={isActive ? { color: def.color } : undefined}
      >
        {def.label}
      </span>

      <span className='text-2xs text-dota-text-muted font-mono shrink-0'>
        {count}
      </span>

      <span
        className={`text-dota-text-muted text-xs shrink-0 transition-transform duration-150 ${
          isActive ? 'rotate-90' : ''
        }`}
      >
        ›
      </span>
    </button>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { isDragging } = useDnD();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  function handleCategoryClick(id: string) {
    setActiveCategoryId((prev) => (prev === id ? null : id));
  }

  const activeDef =
    ALL_CATEGORIES.find((c) => c.id === activeCategoryId) ?? null;

  return (
    <>
      {isDragging && <DragGhost type='item' />}
      <div
        data-no-drop
        className='flex flex-row h-full absolute left-0 top-0 z-10'
      >
        {/* ── Left column: category list ── */}
        <div className='w-52 h-screen flex flex-col bg-[#111319] border-r border-white/5'>
          {/* Header */}
          <div className='px-4 py-3 border-b border-white/5 shrink-0'>
            <h1 className='font-dota uppercase text-dota-gold font-bold tracking-wide text-lg'>
              Forge Codex
            </h1>
            <p className='text-2xs text-dota-text-muted mt-0.5'>Item Browser</p>
          </div>

          {/* Scrollable category list */}
          <nav className='flex-1 overflow-y-auto scrollbar-dark py-1 flex flex-col'>
            {/* Shop categories */}
            <div className='px-3 pt-2.5 pb-1'>
              <span className='text-2xs uppercase tracking-widest text-white/20 font-semibold'>
                Shop
              </span>
            </div>
            {SHOP_CATEGORIES.map((cat) => (
              <CategoryButton
                key={cat.id}
                def={cat}
                count={countFor(cat.id)}
                isActive={activeCategoryId === cat.id}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}

            {/* Divider */}
            <div className='border-t border-white/10 mx-3 my-2' />

            {/* Neutral tiers */}
            <div className='px-3 pb-1'>
              <span className='text-2xs uppercase tracking-widest text-white/20 font-semibold'>
                Neutral
              </span>
            </div>
            {NEUTRAL_CATEGORIES.map((cat) => (
              <CategoryButton
                key={cat.id}
                def={cat}
                count={countFor(cat.id)}
                isActive={activeCategoryId === cat.id}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </nav>
        </div>

        {/* ── Right flyout: item panel ── */}
        {activeDef && (
          <ItemPanel
            categoryId={activeDef.id}
            label={activeDef.label}
            color={activeDef.color}
          />
        )}
      </div>
    </>
  );
}
