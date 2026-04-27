import { getEntriesFor } from './categories';
import { ItemIcon } from './item-icon';

type ItemPanelProps = {
  categoryId: string;
  label: string;
  color: string;
};

export function ItemPanel({ categoryId, label, color }: ItemPanelProps) {
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
