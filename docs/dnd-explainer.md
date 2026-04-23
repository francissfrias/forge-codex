# Drag and Drop — How It Works & What We Fixed

## The Big Picture

Think of your app as three zones:

```
┌─────────────┬──────────────┬────────────────────────────┐
│  Category   │  Item Panel  │                            │
│  List       │  (flyout)    │    The Canvas (ReactFlow)  │
│  (sidebar)  │              │                            │
└─────────────┴──────────────┴────────────────────────────┘
```

The goal: **grab an item from the panel, drag it onto the canvas, and it sticks there as a node.**

---

## Fix 1 — Dropping inside the sidebar still created a node

**The problem code — `useDnd.tsx` (before):**
```tsx
const isDroppingOnFlow = elementUnderPointer?.closest('.react-flow');

if (isDroppingOnFlow) {
  dropAction?.({ position: flowPosition }); // ALWAYS fired because sidebar is inside .react-flow
}
```
The sidebar lives inside the `.react-flow` div in the HTML. So `closest('.react-flow')` always found it — even when you dropped on a sidebar button.

**Step 1 — `sidebar.tsx`: stamp the sidebar with a label**
```tsx
// BEFORE
<div className='flex flex-row h-full absolute left-0 top-0 z-10'>

// AFTER
<div data-no-drop className='flex flex-row h-full absolute left-0 top-0 z-10'>
```
`data-no-drop` is just a custom HTML attribute — like a sticky note that says "don't drop here." It has no built-in behavior; we made it meaningful ourselves.

**Step 2 — `useDnd.tsx`: check for that label before creating a node**
```tsx
// BEFORE
const isDroppingOnFlow = elementUnderPointer?.closest('.react-flow');

if (isDroppingOnFlow) {
  dropAction?.({ position: flowPosition });
}

// AFTER
const isDroppingOnFlow = elementUnderPointer?.closest('.react-flow');
const isDroppingOnSidebar = elementUnderPointer?.closest('[data-no-drop]');

if (isDroppingOnFlow && !isDroppingOnSidebar) {
  dropAction?.({ position: flowPosition });
}
```
Now it asks: "Am I on the canvas AND NOT on the sidebar?" Only then does it create the node.

---

## Fix 2 — No item image while dragging

The ghost that follows your cursor had no idea what item you were dragging. Three files changed to pipe that info through.

**Step 1 — `useDnd.tsx`: add a storage slot for the image URL**
```tsx
// BEFORE — context only stored isDragging and dropAction
interface DnDContextType {
  isDragging: boolean;
  setIsDragging: ...;
  dropAction: OnDropAction | null;
  setDropAction: ...;
}

// AFTER — added dragImg as a new slot
interface DnDContextType {
  isDragging: boolean;
  setIsDragging: ...;
  dropAction: OnDropAction | null;
  setDropAction: ...;
  dragImg: string | null;      // ← the image path, e.g. "/items/tango.png"
  setDragImg: ...;
}
```
Context is shared memory any component can read. Adding `dragImg` here means any component — including `DragGhost` — can read it without being given it as a prop.

**Step 2 — `useDnd.tsx`: `onDragStart` now accepts the image and stores it**
```tsx
// BEFORE — only took the event and the drop action
const onDragStart = (event, onDrop) => {
  setIsDragging(true);
  setDropAction(onDrop);
};

// AFTER — third argument: the image path
const onDragStart = (event, onDrop, imgSrc?) => {
  setIsDragging(true);
  setDropAction(onDrop);
  setDragImg(imgSrc ?? null);  // ← store the image in shared memory
};
```
And when the drag ends, it clears it:
```tsx
setIsDragging(false);
setDragImg(null); // ← clean up so ghost doesn't linger
```

**Step 3 — `sidebar.tsx`: pass the image when starting a drag**
```tsx
// BEFORE — no image passed
onDragStart(e, ({ position }) => { ... });

// AFTER — entry.item.img is the path like "/items/tango.png"
onDragStart(
  e,
  ({ position }) => { ... },
  entry.item.img,   // ← this gets stored in context by onDragStart
);
```

**Step 4 — `drag-ghost.tsx`: read the image and display it**
```tsx
// BEFORE — just showed text, no image
export function DragGhost({ type }) {
  const { position } = useDnDPosition();
  return (
    <div style={{ transform: `translate(${position.x}px, ...)` }}>
      {type} Node   {/* ← just "item Node" text */}
    </div>
  );
}

// AFTER — reads dragImg from context, shows actual item image
export function DragGhost() {
  const { position } = useDnDPosition();
  const { dragImg } = useDnD();          // ← reads from shared memory

  return (
    <div
      className='fixed pointer-events-none z-50 w-12 h-12'
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
    >
      {dragImg ? (
        <Image src={`${CDN}${dragImg}`} fill ... />  // ← shows item image
      ) : (
        <div>fallback</div>
      )}
    </div>
  );
}
```
`position: fixed` means it's always positioned relative to the screen, not scrolled inside any container — so it truly follows your cursor everywhere.

---

## Fix 3 — Node appeared empty with no name or image

Two sub-problems here.

**Problem 3a — ReactFlow didn't know what `'itemNode'` meant**

`sidebar.tsx` was creating nodes like this:
```tsx
{
  id: getId(),
  type: 'itemNode',   // ← ReactFlow had no idea what this was
  position,
  data: { key: entry.key, item: entry.item },
}
```
ReactFlow only knows `'input'`, `'output'`, and `'default'` by default. For anything custom, you have to give it a blueprint.

**We created `item-node.tsx` — the blueprint:**
```tsx
export function ItemNode({ data }) {
  const { key, item } = data;  // ← reads what sidebar.tsx stored in data: {}

  return (
    <div className='bg-[#111319] border border-white/10 rounded-lg w-32'>
      <Handle type='target' position={Position.Left} />   {/* ← left connection point */}

      {/* Item image */}
      <div className='relative w-full h-20'>
        <Image src={`${CDN}${item.img}`} fill ... />
      </div>

      {/* Item name + cost */}
      <div className='px-2 py-1.5'>
        <p>{item.dname}</p>
        <p>{item.cost}g</p>
      </div>

      <Handle type='source' position={Position.Right} />  {/* ← right connection point */}
    </div>
  );
}
```
`Handle` is a ReactFlow component — it's the little dot on the node you connect edges to/from.

**Problem 3b — We registered it in `page.tsx`**

Just creating `ItemNode` isn't enough. You have to tell ReactFlow "when you see `type: 'itemNode'`, use this component":
```tsx
// BEFORE — no nodeTypes, ReactFlow didn't know itemNode
<ReactFlow nodes={nodes} edges={edges} ...>

// AFTER — registered the blueprint
const nodeTypes = useMemo(() => ({ itemNode: ItemNode }), []);

<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} ...>
```
`useMemo` here just means "compute this object once, don't recreate it every render" — ReactFlow requires this to avoid unnecessary re-renders.

---

## The Full Chain After All Fixes

```
Press down on item icon (sidebar.tsx)
  → onDragStart(event, dropFn, item.img)
      → stores dropFn + item.img in Context (useDnd.tsx)
           → DragGhost reads item.img from Context, shows at cursor (drag-ghost.tsx)
                → you release pointer
                     → useDnd checks: on canvas? ✅  on sidebar? ❌
                          → calls dropFn({ position })
                               → setNodes adds itemNode to canvas
                                    → ReactFlow looks up nodeTypes['itemNode']
                                         → renders ItemNode with image + name + cost
```

---

## Key Concepts Glossary

| Term | What it means |
|---|---|
| **Context** | Shared memory box — any component in the tree can read/write it without prop drilling |
| **`onPointerDown`** | Fires when you press down with mouse or touch — this is what starts the drag |
| **`pointerup`** | Fires when you release — this is what ends the drag and triggers the drop |
| **`closest(selector)`** | Walks up the DOM from an element looking for a matching parent |
| **`nodeTypes`** | A map you give ReactFlow: `{ 'typeName': ComponentToRender }` |
| **`Handle`** | ReactFlow's connection dot on a node — source = output, target = input |
| **`position: fixed`** | CSS that positions an element relative to the screen, not the page scroll |
| **`useMemo`** | Cache a computed value — only recalculate if dependencies change |
| **`useCallback`** | Cache a function — only recreate if dependencies change |
