'use client';

import { useReactFlow } from '@xyflow/react';
import Image from 'next/image';
import { useDnD } from '../../hooks/useDnd';
import type { ItemEntry } from './types';

const CDN = 'https://cdn.cloudflare.steamstatic.com';

let id = 0;
const getId = () => `dndnode_${id++}`;

export function ItemIcon({ entry }: { entry: ItemEntry }) {
  const { onDragStart } = useDnD();
  const { setNodes } = useReactFlow();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
  };

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
