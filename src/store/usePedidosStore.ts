import { create } from 'zustand';
import { Pedido, PedidoProduto, StatusPedido } from '../tipos';
import { formatarHora } from '../utils/tempo';

interface PedidosStore {
  pedidos: Pedido[];
  adicionarPedido: (pedido: Omit<Pedido, 'id' | 'timestamp' | 'registroTempos' | 'horaPedido'>) => void;
  atualizarStatus: (id: number, status: StatusPedido) => void;
  cancelarPedido: (id: number) => void;
  obterPedidosPorStatus: (status: StatusPedido) => Pedido[];
  calcularTotal: (produtos: PedidoProduto[]) => number;
  obterPedidosPorMesa: (mesa: number) => Pedido[];
}

export const usePedidosStore = create<PedidosStore>((set, get) => ({
  pedidos: [],
  
  adicionarPedido: (novoPedido) => {
    const timestamp = new Date();
    set((state) => ({
      pedidos: [
        ...state.pedidos,
        {
          ...novoPedido,
          id: Date.now(),
          timestamp,
          horaPedido: formatarHora(timestamp),
          registroTempos: [{
            status: 'pendente',
            timestamp
          }]
        },
      ],
    }));
  },
    
  atualizarStatus: (id, status) =>
    set((state) => ({
      pedidos: state.pedidos.map((pedido) =>
        pedido.id === id 
          ? { 
              ...pedido, 
              status,
              registroTempos: [
                ...pedido.registroTempos,
                { status, timestamp: new Date() }
              ]
            } 
          : pedido
      ),
    })),

  cancelarPedido: (id) =>
    set((state) => ({
      pedidos: state.pedidos.map((pedido) =>
        pedido.id === id
          ? {
              ...pedido,
              status: 'cancelado',
              registroTempos: [
                ...pedido.registroTempos,
                { status: 'cancelado', timestamp: new Date() }
              ]
            }
          : pedido
      ),
    })),
    
  obterPedidosPorStatus: (status) => {
    return get().pedidos.filter((pedido) => pedido.status === status);
  },
  
  obterPedidosPorMesa: (mesa) => {
    return get().pedidos.filter((pedido) => pedido.mesa === mesa);
  },
  
  calcularTotal: (produtos) => {
    return produtos.reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    );
  },
}));