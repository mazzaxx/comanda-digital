import { create } from 'zustand';
import { Comanda, ComandaIndividual, Pedido, StatusComanda } from '../tipos';

interface ComandasStore {
  comandas: Comanda[];
  
  // Gerenciamento de Comandas
  abrirComanda: (mesa: number) => number;
  fecharComanda: (comandaId: number) => void;
  buscarComandaAtiva: (mesa: number) => Comanda | undefined;
  listarComandasAtivas: () => Comanda[];
  
  // Gerenciamento de Comandas Individuais
  adicionarComandaIndividual: (comandaId: number, clienteId: number) => void;
  fecharComandaIndividual: (comandaId: number, comandaIndividualId: number) => void;
  
  // Gerenciamento de Pedidos
  adicionarPedido: (comandaId: number, comandaIndividualId: number, pedido: Omit<Pedido, 'id' | 'comandaId' | 'timestamp' | 'registroTempos' | 'horaPedido'>) => void;
  atualizarStatusPedido: (comandaId: number, pedidoId: number, status: Pedido['status']) => void;
  cancelarPedido: (comandaId: number, pedidoId: number) => void;
  
  // Cálculos e Consultas
  calcularTotalComanda: (comandaId: number) => number;
  calcularTotalComandaIndividual: (comandaId: number, comandaIndividualId: number) => number;
}

export const useComandasStore = create<ComandasStore>((set, get) => ({
  comandas: [],
  
  abrirComanda: (mesa) => {
    const novaComanda: Comanda = {
      id: Date.now(),
      mesa,
      status: 'aberta',
      comandasIndividuais: [],
      pedidosGerais: [], // Pedidos não associados a comandas individuais
      timestamp: new Date()
    };
    
    set((state) => ({
      comandas: [...state.comandas, novaComanda]
    }));
    
    return novaComanda.id;
  },
  
  adicionarComandaIndividual: (comandaId, clienteId) => {
    const novaComandaIndividual: ComandaIndividual = {
      id: Date.now(),
      cliente: { id: clienteId, nome: '' },
      pedidos: [],
      status: 'aberta',
      timestamp: new Date()
    };

    set((state) => ({
      comandas: state.comandas.map((comanda) =>
        comanda.id === comandaId
          ? {
              ...comanda,
              comandasIndividuais: [...comanda.comandasIndividuais, novaComandaIndividual]
            }
          : comanda
      )
    }));
  },
  
  fecharComandaIndividual: (comandaId, comandaIndividualId) => {
    set((state) => ({
      comandas: state.comandas.map((comanda) =>
        comanda.id === comandaId
          ? {
              ...comanda,
              comandasIndividuais: comanda.comandasIndividuais.map((ci) =>
                ci.id === comandaIndividualId
                  ? { ...ci, status: 'fechada' }
                  : ci
              )
            }
          : comanda
      )
    }));
  },
  
  fecharComanda: (comandaId) => {
    set((state) => ({
      comandas: state.comandas.map((comanda) =>
        comanda.id === comandaId
          ? { ...comanda, status: 'fechada' }
          : comanda
      )
    }));
  },
  
  buscarComandaAtiva: (mesa) => {
    return get().comandas.find(
      (comanda) => comanda.mesa === mesa && comanda.status === 'aberta'
    );
  },
  
  listarComandasAtivas: () => {
    return get().comandas.filter((comanda) => comanda.status === 'aberta');
  },
  
  adicionarPedido: (comandaId, comandaIndividualId, novoPedido) => {
    const timestamp = new Date();
    const pedido: Pedido = {
      ...novoPedido,
      id: Date.now(),
      comandaId,
      timestamp,
      registroTempos: [{
        status: 'pendente',
        timestamp
      }],
      horaPedido: timestamp.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    set((state) => ({
      comandas: state.comandas.map((comanda) => {
        if (comanda.id !== comandaId) return comanda;

        if (comandaIndividualId === 0) {
          // Adiciona aos pedidos gerais da mesa
          return {
            ...comanda,
            pedidosGerais: [...(comanda.pedidosGerais || []), pedido]
          };
        } else {
          // Adiciona à comanda individual específica
          return {
            ...comanda,
            comandasIndividuais: comanda.comandasIndividuais.map((ci) =>
              ci.id === comandaIndividualId
                ? { ...ci, pedidos: [...ci.pedidos, pedido] }
                : ci
            )
          };
        }
      })
    }));
  },
  
  atualizarStatusPedido: (comandaId, pedidoId, status) => {
    set((state) => ({
      comandas: state.comandas.map((comanda) => {
        if (comanda.id !== comandaId) return comanda;

        // Atualiza nos pedidos gerais
        if (comanda.pedidosGerais) {
          const pedidoGeralIndex = comanda.pedidosGerais.findIndex(p => p.id === pedidoId);
          if (pedidoGeralIndex !== -1) {
            const pedidosGerais = [...comanda.pedidosGerais];
            pedidosGerais[pedidoGeralIndex] = {
              ...pedidosGerais[pedidoGeralIndex],
              status,
              registroTempos: [
                ...pedidosGerais[pedidoGeralIndex].registroTempos,
                { status, timestamp: new Date() }
              ]
            };
            return { ...comanda, pedidosGerais };
          }
        }

        // Atualiza nas comandas individuais
        return {
          ...comanda,
          comandasIndividuais: comanda.comandasIndividuais.map((ci) => ({
            ...ci,
            pedidos: ci.pedidos.map((pedido) =>
              pedido.id === pedidoId
                ? {
                    ...pedido,
                    status,
                    registroTempos: [
                      ...pedido.registroTempos,
                      { status, timestamp: new Date() }
                    ]
                  }
                : pedido
            )
          }))
        };
      })
    }));
  },

  cancelarPedido: (comandaId, pedidoId) => {
    set((state) => ({
      comandas: state.comandas.map((comanda) => {
        if (comanda.id !== comandaId) return comanda;

        // Cancela nos pedidos gerais
        if (comanda.pedidosGerais) {
          const pedidoGeralIndex = comanda.pedidosGerais.findIndex(p => p.id === pedidoId);
          if (pedidoGeralIndex !== -1) {
            const pedidosGerais = [...comanda.pedidosGerais];
            pedidosGerais[pedidoGeralIndex] = {
              ...pedidosGerais[pedidoGeralIndex],
              status: 'cancelado',
              registroTempos: [
                ...pedidosGerais[pedidoGeralIndex].registroTempos,
                { status: 'cancelado', timestamp: new Date() }
              ]
            };
            return { ...comanda, pedidosGerais };
          }
        }

        // Cancela nas comandas individuais
        return {
          ...comanda,
          comandasIndividuais: comanda.comandasIndividuais.map((ci) => ({
            ...ci,
            pedidos: ci.pedidos.map((pedido) =>
              pedido.id === pedidoId
                ? {
                    ...pedido,
                    status: 'cancelado',
                    registroTempos: [
                      ...pedido.registroTempos,
                      { status: 'cancelado', timestamp: new Date() }
                    ]
                  }
                : pedido
            )
          }))
        };
      })
    }));
  },
  
  calcularTotalComanda: (comandaId) => {
    const comanda = get().comandas.find((c) => c.id === comandaId);
    if (!comanda) return 0;
    
    // Soma dos pedidos gerais
    const totalPedidosGerais = (comanda.pedidosGerais || []).reduce((total, pedido) => {
      if (pedido.status === 'cancelado') return total;
      return total + pedido.produtos.reduce((subtotal, item) => {
        return subtotal + (item.produto.preco * item.quantidade);
      }, 0);
    }, 0);

    // Soma dos pedidos das comandas individuais
    const totalComandasIndividuais = comanda.comandasIndividuais.reduce((total, ci) => {
      return total + get().calcularTotalComandaIndividual(comandaId, ci.id);
    }, 0);

    return totalPedidosGerais + totalComandasIndividuais;
  },
  
  calcularTotalComandaIndividual: (comandaId, comandaIndividualId) => {
    const comanda = get().comandas.find((c) => c.id === comandaId);
    if (!comanda) return 0;
    
    const comandaIndividual = comanda.comandasIndividuais.find((ci) => ci.id === comandaIndividualId);
    if (!comandaIndividual) return 0;
    
    return comandaIndividual.pedidos.reduce((total, pedido) => {
      if (pedido.status === 'cancelado') return total;
      return total + pedido.produtos.reduce((subtotal, item) => {
        return subtotal + item.produto.preco * item.quantidade;
      }, 0);
    }, 0);
  }
}));