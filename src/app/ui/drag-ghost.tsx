import Image from 'next/image';
import { useDnD, useDnDPosition } from '../hooks/useDnd';

const CDN = 'https://cdn.cloudflare.steamstatic.com';

// The DragGhost component is used to display a ghost node when dragging a node into the flow.
export function DragGhost({ type }: { type?: string | null }) {
  const { position } = useDnDPosition();
  const { dragImg } = useDnD();

  if (!position) return null;

  return (
    <div
      className='fixed pointer-events-none z-50 w-12 h-12 rounded overflow-hidden border border-white/20 shadow-xl opacity-80'
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {dragImg ? (
        <Image
          src={`${CDN}${dragImg}`}
          alt='dragging'
          fill
          sizes='48px'
          className='object-cover'
          unoptimized
        />
      ) : (
        <div className='w-full h-full bg-[#111319] flex items-center justify-center'>
          <span className='text-xs text-white/50'>{type}</span>
        </div>
      )}
    </div>
  );
}
