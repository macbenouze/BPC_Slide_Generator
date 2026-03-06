import React from 'react';
import { SlideGenerator } from './components/SlideGenerator';

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-900 bg-black min-h-screen">
      <SlideGenerator />
    </div>
  );
};

export default App;