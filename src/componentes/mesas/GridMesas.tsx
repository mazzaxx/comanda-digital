import React from 'react';
import { useComandasStore } from '../../store/useComandasStore';

interface GridMesasProps {
  onMesaSelecionada: (mesa: number) => void;
}

export function GridMesas({ onMesaSelecionada }: GridMesasProps) {
  const buscarComandaAtiva = useComandasStore((state) => state.buscarComandaAtiva);
  
  const mesas = Array.from({ length: 10 }, (_, i) => i + 1);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {mesas.map((mesa) => {
        const comandaAtiva = buscarComandaAtiva(mesa);
        
        return (
          <button
            key={mesa}
            onClick={() => onMesaSelecionada(mesa)}
            className={`
              p-8 rounded-lg shadow-md text-center transition-all
              ${comandaAtiva 
                ? 'bg-blue-100 hover:bg-blue-200' 
                : 'bg-white hover:bg-gray-50'}
            `}
          >
            <span className="text-2xl font-bold block mb-2">Mesa {mesa}</span>
            {comandaAtiva && (
              <span className="text-sm text-blue-600">
                Comanda Aberta
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}