import { Pedido, StatusPedido } from '../tipos';

export const statusPedidoLabel: Record<StatusPedido, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  preparando: 'Em Preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado'
};

export const statusPedidoCor: Record<StatusPedido, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  preparando: 'bg-purple-100 text-purple-800',
  pronto: 'bg-green-100 text-green-800',
  entregue: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800'
};

export const podeAvancarStatus = (statusAtual: StatusPedido): StatusPedido | null => {
  const fluxo: StatusPedido[] = ['pendente', 'confirmado', 'preparando', 'pronto', 'entregue'];
  const indexAtual = fluxo.indexOf(statusAtual);
  
  if (indexAtual === -1 || indexAtual === fluxo.length - 1) return null;
  return fluxo[indexAtual + 1];
};

export const ordenarPedidos = (pedidos: Pedido[]): Pedido[] => {
  const prioridade: Record<StatusPedido, number> = {
    pendente: 0,
    confirmado: 1,
    preparando: 2,
    pronto: 3,
    entregue: 4,
    cancelado: 5
  };

  return [...pedidos].sort((a, b) => {
    // Primeiro por prioridade de status
    if (prioridade[a.status] !== prioridade[b.status]) {
      return prioridade[a.status] - prioridade[b.status];
    }
    // Depois por timestamp
    return a.timestamp.getTime() - b.timestamp.getTime();
  });
};