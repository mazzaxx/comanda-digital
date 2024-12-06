import React, { useState } from 'react';
import { GridMesas } from '../componentes/mesas/GridMesas';
import { ResumoComanda } from '../componentes/comandas/ResumoComanda';
import { NovoPedido } from '../componentes/pedidos/NovoPedido';
import { NovaComandaIndividual } from '../componentes/comandas/NovaComandaIndividual';
import { useComandasStore } from '../store/useComandasStore';
import { ComandaIndividual } from '../tipos';

export function Garcom() {
  const [mesaAtual, setMesaAtual] = useState<number | null>(null);
  const { buscarComandaAtiva, abrirComanda } = useComandasStore();

  const handleMesaSelecionada = (mesa: number) => {
    setMesaAtual(mesa);
    if (!buscarComandaAtiva(mesa)) {
      abrirComanda(mesa);
    }
  };

  const comandaAtiva = mesaAtual ? buscarComandaAtiva(mesaAtual) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Área do Garçom</h1>
      
      <div className="mb-8">
        <GridMesas onMesaSelecionada={handleMesaSelecionada} />
      </div>

      {comandaAtiva && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Comanda da Mesa {comandaAtiva.mesa}</h2>
            <ResumoComanda comanda={comandaAtiva} />
            <NovaComandaIndividual
              mesaId={mesaAtual!}
              comandaId={comandaAtiva.id}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Novo Pedido</h2>
            <NovoPedido
              comandaId={comandaAtiva.id}
              mesa={comandaAtiva.mesa}
              comandasIndividuais={comandaAtiva.comandasIndividuais}
            />
          </div>
        </div>
      )}
    </div>
  );
}