'use client';
import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Panel,
  type NodeOrigin,
  type OnConnectStart,
  type OnConnectEnd,
  type InternalNode,
  useStoreApi,
  useReactFlow,
} from '@xyflow/react';
import { shallow } from 'zustand/shallow';
import useStore, { type RFState } from '../lib/store';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
});

const nodeTypes = { mindmap: MindMapNode };
const edgeTypes = { mindmap: MindMapEdge };
const nodeOrigin: NodeOrigin = [0.5, 0.5];

function MindMap() {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStore(
    selector,
    shallow,
  );
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);
  const addChildNode = useStore((state) => state.addChildNode);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const getChildNodePosition = (
    event: MouseEvent | TouchEvent,
    parentNode?: InternalNode,
  ) => {
    const { domNode } = store.getState();
    if (
      !domNode ||
      !parentNode?.internals?.positionAbsolute ||
      !parentNode?.measured?.width ||
      !parentNode?.measured?.height
    ) {
      return;
    }

    const clientX =
      'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY =
      'clientY' in event ? event.clientY : event.touches[0].clientY;

    const panePosition = screenToFlowPosition({ x: clientX, y: clientY });

    return {
      x:
        panePosition.x -
        parentNode.internals.positionAbsolute.x +
        parentNode.measured.width / 2,
      y:
        panePosition.y -
        parentNode.internals.positionAbsolute.y +
        parentNode.measured.height / 2,
    };
  };

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeLookup } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane',
      );
      const node = (event.target as Element).closest('.react-flow__node');

      if (node) {
        node.querySelector('input')?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeLookup.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(event, parentNode);
        if (parentNode && childNodePosition) {
          addChildNode(parentNode.internals.userNode, childNodePosition);
        }
      }
    },
    [screenToFlowPosition],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      deleteKeyCode="Delete"
      fitView
    >
      <Controls showInteractive={false} />
      <Panel position="top-left" className="header">
        React Flow Mind Map
      </Panel>
    </ReactFlow>
  );
}

export default MindMap;
