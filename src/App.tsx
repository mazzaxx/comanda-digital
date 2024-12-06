import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Cabecalho } from './componentes/layout/Cabecalho';
import { Inicio } from './paginas/Inicio';
import { Garcom } from './paginas/Garcom';
import { Cozinha } from './paginas/Cozinha';
import { Caixa } from './paginas/Caixa';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Cabecalho />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/garcom" element={<Garcom />} />
            <Route path="/cozinha" element={<Cozinha />} />
            <Route path="/caixa" element={<Caixa />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;