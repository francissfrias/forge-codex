# Forge Codex — Dota 2 Item Builder

A **React Flow** practice project built with Next.js 16, React 19, and Tailwind CSS v4.

The goal is a node-based canvas where you drag Dota 2 items onto the board, connect them via recipe edges, and see the combined result — replicating the item-crafting system from Dota 2.

## What it does

- **Canvas** — React Flow workspace where item nodes can be placed and connected
- **Sidebar** — Category-based item browser (Shop + Neutral tiers); click a category to open a flyout panel with all its items in a grid
- **Item Browser** (`/items`) — Full paginated view of every Dota 2 item with hover tooltips (stats, abilities, cooldown, mana cost, lore) and a click modal that shows the full recursive recipe tree
- **Design system** — Custom Dota-themed token set (gold palette, attribute colors, panel shadows, fonts)

## Tech stack

| Tool          | Version | Purpose                                              |
| ------------- | ------- | ---------------------------------------------------- |
| Next.js       | 16      | App Router, server components, image optimization    |
| React         | 19      | UI, React Compiler (automatic memoization)           |
| @xyflow/react | 12      | Node-based canvas / recipe graph                     |
| dotaconstants | 10.8    | Dota 2 item data (stats, abilities, recipes, images) |
| Tailwind CSS  | 4       | Styling via design tokens (`@theme`)                 |
| TypeScript    | 5       | Full type safety                                     |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the canvas builder.
Open [http://localhost:3000/items](http://localhost:3000/items) for the full item browser.

## Project structure

```
src/app/
├── page.tsx              # Canvas builder (React Flow)
├── layout.tsx            # Root layout + fonts
├── globals.css           # Dota design tokens (@theme)
├── components/
│   └── Sidebar.tsx       # Category list + flyout item panel
├── items/
│   ├── page.tsx          # /items server shell
│   └── ItemsPageClient.tsx  # Full item browser (tabs, tooltips, modal)
└── ui/
    └── page.tsx          # /ui design system showcase
```

## Roadmap

- [ ] Drag items from sidebar onto the canvas as item nodes
- [ ] Connect component items to a crafted item via recipe edges
- [ ] Auto-detect valid recipes and display the result item
- [ ] Highlight missing components for a target item
- [ ] Export / share builds
