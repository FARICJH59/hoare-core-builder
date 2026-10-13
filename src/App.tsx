import React, { useState, useEffect } from 'react';

const INITIAL_CODE = `export default function DynamicApp() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#0f172a', borderRadius: '8px' }}>
      <h2>⚡ Live HOARE Sandbox Component</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Increment State
      </button>
    </div>
  );
}`;

export default function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body style="margin: 0; background: #1e293b; color: white;">
          <div id="root"></div>
          <script type="text/babel">
            ${code.replace('export default function', 'function')}
            ReactDOM.createRoot(document.getElementById('root')).render(<DynamicApp />);
          </script>
        </body>
      </html>
    `;
    setOutput(previewContent);
  }, [code]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#090d16', color: '#e2e8f0', fontFamily: 'monospace' }}>
      <header style={{ padding: '12px 20px', borderBottom: '1px solid #1e293b', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 'bold', color: '#818cf8' }}>⚡ HOARE × CodePen Engine v2.0</span>
          <span style={{ marginLeft: '12px', fontSize: '12px', background: '#1e1b4b', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px' }}>Aegis Verified</span>
        </div>
        <div style={{ fontSize: '12px', color: '#4ade80' }}>● Live Execution Enabled</div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' }}>
          <div style={{ padding: '8px 16px', background: '#1e293b', fontSize: '12px', color: '#94a3b8' }}>App.tsx (Editable Code)</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#090d16',
              color: '#f8fafc',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '14px',
              border: 'none',
              outline: 'none',
              resize: 'none'
            }}
            spellCheck="false"
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 16px', background: '#1e293b', fontSize: '12px', color: '#94a3b8' }}>Live Dynamic Output</div>
          <iframe
            srcDoc={output}
            title="preview"
            style={{ flex: 1, width: '100%', border: 'none', background: '#1e293b' }}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
