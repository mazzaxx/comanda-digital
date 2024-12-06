import React from 'react';
import { ComandaIndividual as TipoComandaIndividual } from '../../tipos';
import { useClientesStore } from '../../store/useClientesStore';
import { formatarMoeda } from '../../utils/formatadores';
import { User } from 'lucide-react';

interface ComandaIndividualProps {
  comanda: TipoComandaIndividual;
  onSelecionarComanda: () => void;
}

export function ComandaIndividual({ comanda, onSelecionarComanda }: ComandaIndividualProps) {
  const cliente = useClientesStore((state) => state.obterCliente(comanda.cliente.id));

  const calcularTotal = () => {
    return comanda.pedidos.reduce((total, pedido) => {
      return total + pedido.produtos.reduce((subtotal, item) => {
        return subtotal + (item.produto.preco * item.quantidade);
      }, 0);
    }, 0);
  };

  return (
    <div 
      onClick={onSelecionarComanda}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-100 rounded-full">
          <User size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{cliente?.nome}</h3>
          {cliente?.observacoes && (
            <p className="text-sm text-gray-600">{cliente.observacoes}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Pedidos:</span>
          <span>{comanda.pedidos.length}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>{formatarMoeda(calcularTotal())}</span>
        </div>
      </div>
    </div>
  );
}