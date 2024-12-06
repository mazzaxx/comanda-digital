import React from 'react';
import { StatusPedido as TipoStatusPedido } from '../../tipos';
import { statusPedidoLabel, statusPedidoCor } from '../../utils/pedidos';

interface StatusPedidoProps {
  status: TipoStatusPedido;
  className?: string;
}

export function StatusPedido({ status, className = '' }: StatusPedidoProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusPedidoCor[status]} ${className}`}>
      {statusPedidoLabel[status]}
    </span>
  );
}