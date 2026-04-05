'use client';
import { ReactFlowProvider } from '@xyflow/react';
import MindMap from './components/MindMap';
import '@xyflow/react/dist/style.css';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <MindMap />
      </ReactFlowProvider>
    </div>
  );
}
