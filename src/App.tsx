import { useEffect, useRef } from 'react';
import './App.css';
import { setupChwazi } from './finger-point';

function App() {
  const cleanFunc = useRef<() => void>(() => {});

  useEffect(() => {
    const container = document.getElementById('container');
    if (container) {
      cleanFunc.current = setupChwazi(container, container);
    }
    return () => {
      cleanFunc.current?.();
    };
  }, []);

  return <div id="container"></div>;
}

export default App;
