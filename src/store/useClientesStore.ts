import { create } from 'zustand';
import { Cliente } from '../tipos';

interface ClientesStore {
  clientes: Cliente[];
  adicionarCliente: (nome: string, observacoes?: string) => Cliente;
  removerCliente: (id: number) => void;
  atualizarCliente: (id: number, nome: string, observacoes?: string) => void;
  obterCliente: (id: number) => Cliente | undefined;
}

export const useClientesStore = create<ClientesStore>((set, get) => ({
  clientes: [],

  adicionarCliente: (nome, observacoes) => {
    const novoCliente: Cliente = {
      id: Date.now(),
      nome,
      observacoes
    };

    set((state) => ({
      clientes: [...state.clientes, novoCliente]
    }));

    return novoCliente;
  },

  removerCliente: (id) => {
    set((state) => ({
      clientes: state.clientes.filter(cliente => cliente.id !== id)
    }));
  },

  atualizarCliente: (id, nome, observacoes) => {
    set((state) => ({
      clientes: state.clientes.map(cliente =>
        cliente.id === id
          ? { ...cliente, nome, observacoes }
          : cliente
      )
    }));
  },

  obterCliente: (id) => {
    return get().clientes.find(cliente => cliente.id === id);
  }
}));