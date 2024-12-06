import React, { useState } from 'react';
import { useClientesStore } from '../../store/useClientesStore';
import { useComandasStore } from '../../store/useComandasStore';
import { Plus } from 'lucide-react';

interface NovaComandaIndividualProps {
  mesaId: number;
  comandaId: number;
  onComandaCriada: () => void;
}

export function NovaComandaIndividual({ mesaId, comandaId, onComandaCriada }: NovaComandaIndividualProps) {
  const [nome, setNome] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const { adicionarCliente } = useClientesStore();
  const { adicionarComandaIndividual } = useComandasStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) return;

    const cliente = adicionarCliente(nome, observacoes);
    adicionarComandaIndividual(comandaId, cliente.id);
    
    setNome('');
    setObservacoes('');
    setMostrarForm(false);
    onComandaCriada();
  };

  if (!mostrarForm) {
    return (
      <button
        onClick={() => setMostrarForm(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <Plus size={20} />
        Adicionar Cliente
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Cliente
        </label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Digite o nome do cliente"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
          Observações (opcional)
        </label>
        <textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Alguma observação sobre o cliente?"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={() => setMostrarForm(false)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}