import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { createWithEqualityFn } from 'zustand/traditional';

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'mindmap',
      data: { label: 'React Flow Mind Map' },
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  addChildNode: (parentNode, position) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: 'mindmap',
      data: { label: 'New Node' },
      position,
      parentId: parentNode.id,
    };
    const newEdge: Edge = {
      id: crypto.randomUUID(),
      source: parentNode.id,
      target: newNode.id,
    };
    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },

  updateNodeLabel: (nodeId, label) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label } } : node,
      ),
    });
  },
}));

export default useStore;
