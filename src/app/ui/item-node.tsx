'use client';

import { Handle, NodeProps, Position } from '@xyflow/react';
import Image from 'next/image';

const CDN = 'https://cdn.cloudflare.steamstatic.com';

type ItemData = {
  key: string;
  item: {
    dname: string;
    img: string;
    cost: number;
    qual?: string;
  };
};

export function ItemNode({ data }: NodeProps) {
  const { key, item } = data as unknown as ItemData;

  return (
    <div className='bg-[#111319] border border-white/10 rounded-lg overflow-hidden w-32 shadow-lg select-none'>
      <Handle type='target' position={Position.Left} />

      <div className='relative w-full h-20'>
        <Image
          src={`${CDN}${item.img}`}
          alt={item.dname || key}
          fill
          sizes='128px'
          className='object-cover'
          unoptimized
        />
      </div>

      <div className='px-2 py-1.5'>
        <p className='text-xs font-semibold text-white truncate'>
          {item.dname}
        </p>
        {item.cost > 0 && (
          <p className='text-[10px] text-yellow-400 font-mono mt-0.5'>
            {item.cost}g
          </p>
        )}
      </div>

      <Handle type='source' position={Position.Right} />
    </div>
  );
}
