import React, { useState } from 'react';
import { ListaProdutos } from './ListaProdutos';
import { produtos } from '../../dados/produtos';
import { useComandasStore } from '../../store/useComandasStore';
import { usePedidosStore } from '../../store/usePedidosStore';
import { useClientesStore } from '../../store/useClientesStore';
import { PedidoProduto, ComandaIndividual } from '../../tipos';

interface NovoPedidoProps {
  comandaId: number;
  mesa: number;
  comandasIndividuais: ComandaIndividual[];
}

export function NovoPedido({ comandaId, mesa, comandasIndividuais }: NovoPedidoProps) {
  const [categoria, setCategoria] = useState('Lanches');
  const [observacoes, setObservacoes] = useState('');
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [comandaIndividualId, setComandaIndividualId] = useState<number | ''>('');
  
  const adicionarPedido = useComandasStore((state) => state.adicionarPedido);
  const adicionarPedidoCozinha = usePedidosStore((state) => state.adicionarPedido);
  const obterCliente = useClientesStore((state) => state.obterCliente);

  const categorias = ['Lanches', 'Porções', 'Bebidas'];

  const handleQuantidadeChange = (produtoId: number, delta: number) => {
    setQuantidades(prev => {
      const novaQuantidade = (prev[produtoId] || 0) + delta;
      if (novaQuantidade <= 0) {
        const { [produtoId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [produtoId]: novaQuantidade };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const produtosSelecionados: PedidoProduto[] = Object.entries(quantidades)
      .map(([produtoId, quantidade]) => ({
        produto: produtos.find(p => p.id === Number(produtoId))!,
        quantidade
      }));

    if (produtosSelecionados.length === 0) return;

    const novoPedido = {
      produtos: produtosSelecionados,
      observacoes,
      status: 'pendente',
      mesa,
      comandaId,
      clienteId: comandaIndividualId ? Number(comandaIndividualId) : undefined
    };

    // Adiciona o pedido à comanda
    if (comandaIndividualId) {
      adicionarPedido(comandaId, Number(comandaIndividualId), novoPedido);
    } else {
      adicionarPedido(comandaId, 0, novoPedido); // 0 indica pedido geral da mesa
    }
    
    // Adiciona o pedido à lista da cozinha
    adicionarPedidoCozinha(novoPedido);

    // Limpar formulário
    setQuantidades({});
    setObservacoes('');
    setComandaIndividualId('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Adicionar Pedido - Mesa {mesa}</h3>
        
        {comandasIndividuais.length > 0 && (
          <div className="mb-4">
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente (opcional)
            </label>
            <select
              id="cliente"
              value={comandaIndividualId}
              onChange={(e) => setComandaIndividualId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Mesa Completa</option>
              {comandasIndividuais.map((ci) => {
                const cliente = obterCliente(ci.cliente.id);
                return (
                  <option key={ci.id} value={ci.id}>
                    {cliente?.nome}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoria(cat)}
              className={`px-4 py-2 rounded-lg ${
                categoria === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ListaProdutos
          produtos={produtos}
          categoria={categoria}
          quantidades={quantidades}
          onQuantidadeChange={handleQuantidadeChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 border rounded-lg resize-none"
          rows={3}
          placeholder="Alguma observação especial?"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Total: R$ {Object.entries(quantidades).reduce((total, [produtoId, quantidade]) => {
            const produto = produtos.find(p => p.id === Number(produtoId));
            return total + (produto?.preco || 0) * quantidade;
          }, 0).toFixed(2)}
        </div>
        <button
          type="submit"
          disabled={Object.keys(quantidades).length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar Pedido
        </button>
      </div>
    </form>
  );
}