import React from 'react';
import { Pedido } from '../../tipos';
import { usePedidosStore } from '../../store/usePedidosStore';
import { useClientesStore } from '../../store/useClientesStore';
import { StatusPedido } from './StatusPedido';
import { TempoDecorrido } from './TempoDecorrido';
import { podeAvancarStatus } from '../../utils/pedidos';
import { formatarMoeda } from '../../utils/formatadores';
import { Clock, XCircle } from 'lucide-react';

interface CardPedidoProps {
  pedido: Pedido;
  mostrarAcoes?: boolean;
  onCancelar?: () => void;
}

export function CardPedido({ pedido, mostrarAcoes = true, onCancelar }: CardPedidoProps) {
  const atualizarStatus = usePedidosStore((state) => state.atualizarStatus);
  const calcularTotal = usePedidosStore((state) => state.calcularTotal);
  const obterCliente = useClientesStore((state) => state.obterCliente);

  const total = calcularTotal(pedido.produtos);
  const proximoStatus = podeAvancarStatus(pedido.status);
  const cliente = pedido.clienteId ? obterCliente(pedido.clienteId) : null;

  const podeCancelar = pedido.status !== 'entregue' && pedido.status !== 'cancelado';

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">Mesa {pedido.mesa}</h3>
          {cliente && (
            <p className="text-sm text-gray-600">Cliente: {cliente.nome}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            <span>{pedido.horaPedido}</span>
            <span className="text-gray-300">|</span>
            <TempoDecorrido inicio={pedido.timestamp} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusPedido status={pedido.status} />
          {podeCancelar && onCancelar && (
            <button
              onClick={onCancelar}
              className="text-red-500 hover:text-red-700"
              title="Cancelar Pedido"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-2 mb-4 divide-y">
        {pedido.produtos.map((item, index) => (
          <li key={index} className="flex justify-between py-2">
            <div>
              <span className="font-medium">
                {item.quantidade}x {item.produto.nome}
              </span>
              {item.observacoes && (
                <p className="text-sm text-gray-600">Obs: {item.observacoes}</p>
              )}
            </div>
            <span className="text-gray-600">
              {formatarMoeda(item.produto.preco * item.quantidade)}
            </span>
          </li>
        ))}
      </ul>

      {pedido.observacoes && (
        <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-2 rounded">
          Observações: {pedido.observacoes}
        </p>
      )}

      <div className="flex justify-between items-center font-bold border-t pt-4">
        <span>Total:</span>
        <span>{formatarMoeda(total)}</span>
      </div>

      {mostrarAcoes && proximoStatus && pedido.status !== 'cancelado' && (
        <div className="mt-4">
          <button
            onClick={() => atualizarStatus(pedido.id, proximoStatus)}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {proximoStatus === 'confirmado' && 'Confirmar Pedido'}
            {proximoStatus === 'preparando' && 'Iniciar Preparo'}
            {proximoStatus === 'pronto' && 'Marcar como Pronto'}
            {proximoStatus === 'entregue' && 'Confirmar Entrega'}
          </button>
        </div>
      )}
    </div>
  );
}