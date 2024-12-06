import React, { useState } from 'react';
import { useComandasStore } from '../../store/useComandasStore';

interface SeletorMesaProps {
  onMesaSelecionada: (mesa: number, comandaId: number) => void;
}

export function SeletorMesa({ onMesaSelecionada }: SeletorMesaProps) {
  const [mesa, setMesa] = useState<string>('');
  const { buscarComandaAtiva, abrirComanda } = useComandasStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeroMesa = parseInt(mesa, 10);
    
    if (isNaN(numeroMesa)) return;
    
    let comandaAtiva = buscarComandaAtiva(numeroMesa);
    
    if (!comandaAtiva) {
      const novaComandaId = abrirComanda(numeroMesa);
      onMesaSelecionada(numeroMesa, novaComandaId);
    } else {
      onMesaSelecionada(numeroMesa, comandaAtiva.id);
    }
    
    setMesa('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex-1">
        <label htmlFor="mesa" className="block text-sm font-medium text-gray-700 mb-1">
          Número da Mesa
        </label>
        <input
          type="number"
          id="mesa"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
          min="1"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Selecionar Mesa
      </button>
    </form>
  );
}