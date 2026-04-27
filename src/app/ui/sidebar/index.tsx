'use client';

import { useState } from 'react';
import { useDnD } from '../../hooks/useDnd';
import { DragGhost } from '../drag-ghost';
import {
  ALL_CATEGORIES,
  NEUTRAL_CATEGORIES,
  SHOP_CATEGORIES,
  countFor,
} from './categories';
import { CategoryButton } from './category-button';
import { ItemPanel } from './item-panel';

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
