import React from 'react';
import { CardPedido } from '../componentes/pedidos/CardPedido';
import { ResumoComanda } from '../componentes/comandas/ResumoComanda';
import { usePedidosStore } from '../store/usePedidosStore';
import { useComandasStore } from '../store/useComandasStore';

export function Caixa() {
  const comandasAtivas = useComandasStore((state) => state.listarComandasAtivas());
  const fecharComanda = useComandasStore((state) => state.fecharComanda);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Caixa</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comandasAtivas.map((comanda) => (
          <div key={comanda.id} className="space-y-4">
            <ResumoComanda 
              comanda={comanda} 
              onFecharComanda={() => fecharComanda(comanda.id)}
            />
          </div>
        ))}
      </div>

      {comandasAtivas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma comanda aberta no momento.
        </div>
      )}
    </div>
  );
}