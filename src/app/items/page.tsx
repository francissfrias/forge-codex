import ItemsPageClient from './ItemsPageClient';

export const metadata = {
  title: 'Item Browser — Forge Codex',
  description: 'Browse all Dota 2 items with tooltips and recipe trees.',
};

export default function ItemsPage() {
  return <ItemsPageClient />;
}
