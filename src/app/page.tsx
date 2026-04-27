'use client';

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Position,
  ReactFlow,
} from '@xyflow/react';
import { item_colors, item_ids, items } from 'dotaconstants';
import { useState } from 'react';
import DndProvider from './providers/dndprovider';
import { ItemNode } from './ui/item-node';
import { Sidebar } from './ui/sidebar';

const nodeTypes = { itemNode: ItemNode };

const initialNodes: Node[] = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'input',
    sourcePosition: Position.Right,
  },
  {
    id: 'n2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const initialEdges: Edge[] = [
  // {
  //   id: 'n1-n2',
  //   source: 'n1',
  //   target: 'n2',
  //   type: 'step',
  //   label: 'connects with',
  // },
];

const Home = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect: OnConnect = (connection) =>
    setEdges((eds) => addEdge(connection, eds));

  console.log(items, item_ids, item_colors);

  return (
    <DndProvider>
      <div className='h-screen w-screen flex bg-dota-bg'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Sidebar />
          <Background />
          <Controls className='bottom-0 left-0 translate-x-52' />
          <MiniMap
            bgColor='black'
            maskColor='none'
            nodeColor='white'
            className='border-0 ring-0'
          />
        </ReactFlow>
      </div>
    </DndProvider>
  );
};

export default Home;
