import type { CategoryDef } from './types';

type CategoryButtonProps = {
  def: CategoryDef;
  count: number;
  isActive: boolean;
  onClick: () => void;
};

export function CategoryButton({
  def,
  count,
  isActive,
  onClick,
}: CategoryButtonProps) {
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
