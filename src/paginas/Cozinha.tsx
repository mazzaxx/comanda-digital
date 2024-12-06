import React, { useState } from 'react';
import { CardPedido } from '../componentes/pedidos/CardPedido';
import { usePedidosStore } from '../store/usePedidosStore';
import { StatusPedido, Pedido } from '../tipos';
import { ordenarPedidos } from '../utils/pedidos';

export function Cozinha() {
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido[]>(['pendente', 'confirmado', 'preparando']);
  
  const pedidos = usePedidosStore((state) => 
    ordenarPedidos(state.pedidos.filter(p => filtroStatus.includes(p.status)))
  );

  const agruparPedidosPorStatus = (pedidos: Pedido[]) => {
    return pedidos.reduce((grupos, pedido) => {
      const grupo = grupos[pedido.status] || [];
      return { ...grupos, [pedido.status]: [...grupo, pedido] };
    }, {} as Record<StatusPedido, Pedido[]>);
  };

  const pedidosAgrupados = agruparPedidosPorStatus(pedidos);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cozinha</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroStatus(['pendente', 'confirmado', 'preparando'])}
            className="px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            Em Andamento
          </button>
          <button
            onClick={() => setFiltroStatus(['pronto'])}
            className="px-4 py-2 rounded bg-green-100 text-green-800 hover:bg-green-200"
          >
            Prontos
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(pedidosAgrupados).map(([status, pedidosStatus]) => (
          <div key={status} className="space-y-4">
            <h2 className="font-semibold text-lg capitalize border-b pb-2">
              {status === 'pendente' && 'Pedidos Pendentes'}
              {status === 'confirmado' && 'Pedidos Confirmados'}
              {status === 'preparando' && 'Em Preparo'}
              {status === 'pronto' && 'Prontos para Entrega'}
              <span className="ml-2 text-sm text-gray-500">
                ({pedidosStatus.length})
              </span>
            </h2>
            {pedidosStatus.map((pedido) => (
              <CardPedido key={pedido.id} pedido={pedido} />
            ))}
          </div>
        ))}
      </div>

      {pedidos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum pedido encontrado com os filtros selecionados.
        </div>
      )}
    </div>
  );
}