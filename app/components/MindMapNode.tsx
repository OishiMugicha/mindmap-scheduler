'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Handle, type NodeProps, type Node, Position } from '@xyflow/react';
import useStore from '../lib/store';

export type MindMapNodeData = { label: string };
export type MindMapNodeType = Node<MindMapNodeData, 'mindmap'>;

function MindMapNode({ id, data }: NodeProps<MindMapNodeType>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8}px`;
    }
  }, [data.label.length]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  return (
    <>
      <div className="inputWrapper">
        <div className="dragHandle">
          <svg viewBox="0 0 24 24">
            <path
              fill="#333"
              stroke="#333"
              strokeWidth="1"
              d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
        />
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </>
  );
}

export default MindMapNode;
