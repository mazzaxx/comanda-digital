export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
}

export interface PedidoProduto {
  produto: Produto;
  quantidade: number;
  observacoes?: string;
}

export type StatusPedido = 
  | 'pendente'
  | 'confirmado'
  | 'preparando'
  | 'pronto'
  | 'entregue'
  | 'cancelado';

export type StatusComanda = 
  | 'aberta'
  | 'em_fechamento'
  | 'fechada';

export interface RegistroTempo {
  status: StatusPedido;
  timestamp: Date;
}

export interface Cliente {
  id: number;
  nome: string;
  observacoes?: string;
}

export interface Pedido {
  id: number;
  comandaId: number;
  clienteId?: number;
  produtos: PedidoProduto[];
  observacoes: string;
  status: StatusPedido;
  timestamp: Date;
  mesa: number;
  tempoPreparo?: number;
  registroTempos: RegistroTempo[];
  horaPedido: string;
}

export interface ComandaIndividual {
  id: number;
  cliente: Cliente;
  pedidos: Pedido[];
  status: StatusComanda;
  timestamp: Date;
}

export interface Comanda {
  id: number;
  mesa: number;
  status: StatusComanda;
  comandasIndividuais: ComandaIndividual[];
  pedidosGerais?: Pedido[];
  timestamp: Date;
  formaPagamento?: string;
  observacoesFechamento?: string;
}