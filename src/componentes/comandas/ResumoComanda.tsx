import React from 'react';
import { Comanda, ComandaIndividual, Pedido } from '../../tipos';
import { useComandasStore } from '../../store/useComandasStore';
import { useClientesStore } from '../../store/useClientesStore';
import { formatarMoeda } from '../../utils/formatadores';
import { StatusPedido } from '../pedidos/StatusPedido';

interface ResumoComandaProps {
  comanda: Comanda;
  onFecharComanda?: () => void;
}

export function ResumoComanda({ comanda, onFecharComanda }: ResumoComandaProps) {
  const calcularTotalComanda = useComandasStore((state) => state.calcularTotalComanda);
  const cancelarPedido = useComandasStore((state) => state.cancelarPedido);
  const obterCliente = useClientesStore((state) => state.obterCliente);
  const total = calcularTotalComanda(comanda.id);

  const renderizarPedidos = (pedidos: Pedido[], clienteNome?: string) => {
    return pedidos.map((pedido) => (
      <div key={pedido.id} className="border-b pb-4 mb-4 last:border-b-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-sm text-gray-500">
              {pedido.horaPedido}
            </span>
            {clienteNome && (
              <span className="ml-2 text-sm text-gray-600">
                Cliente: {clienteNome}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusPedido status={pedido.status} />
            {pedido.status !== 'cancelado' && pedido.status !== 'entregue' && (
              <button
                onClick={() => cancelarPedido(comanda.id, pedido.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
        
        <ul className="space-y-1">
          {pedido.produtos.map((item, index) => (
            <li key={index} className="flex justify-between text-sm">
              <span>{item.quantidade}x {item.produto.nome}</span>
              <span>{formatarMoeda(item.produto.preco * item.quantidade)}</span>
            </li>
          ))}
        </ul>
        
        {pedido.observacoes && (
          <p className="text-sm text-gray-600 mt-1">
            Obs: {pedido.observacoes}
          </p>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Mesa {comanda.mesa}</h3>
        <span className="text-sm text-gray-500">
          Aberta em: {new Date(comanda.timestamp).toLocaleString()}
        </span>
      </div>

      {/* Pedidos Gerais da Mesa */}
      {comanda.pedidosGerais && comanda.pedidosGerais.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Pedidos da Mesa</h4>
          {renderizarPedidos(comanda.pedidosGerais)}
        </div>
      )}

      {/* Comandas Individuais */}
      {comanda.comandasIndividuais.map((comandaIndividual) => {
        const cliente = obterCliente(comandaIndividual.cliente.id);
        if (!cliente || comandaIndividual.pedidos.length === 0) return null;

        return (
          <div key={comandaIndividual.id} className="mb-6">
            <h4 className="font-semibold mb-3">
              Pedidos de {cliente.nome}
            </h4>
            {renderizarPedidos(comandaIndividual.pedidos, cliente.nome)}
          </div>
        );
      })}

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total da Mesa:</span>
          <span className="text-lg font-bold">{formatarMoeda(total)}</span>
        </div>

        {onFecharComanda && (
          <button
            onClick={onFecharComanda}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Fechar Comanda
          </button>
        )}
      </div>
    </div>
  );
}