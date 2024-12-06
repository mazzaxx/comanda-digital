import React from 'react';
import { Produto } from '../../tipos';
import { Plus, Minus } from 'lucide-react';

interface ListaProdutosProps {
  produtos: Produto[];
  categoria: string;
  quantidades: Record<number, number>;
  onQuantidadeChange: (produtoId: number, delta: number) => void;
}

export function ListaProdutos({
  produtos,
  categoria,
  quantidades,
  onQuantidadeChange
}: ListaProdutosProps) {
  const produtosFiltrados = produtos.filter(p => p.categoria === categoria);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {produtosFiltrados.map((produto) => (
        <div
          key={produto.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{produto.nome}</h3>
              <p className="text-gray-600 text-sm mb-2">{produto.descricao}</p>
              <p className="text-blue-600 font-bold">
                R$ {produto.preco.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => onQuantidadeChange(produto.id, -1)}
                disabled={!quantidades[produto.id]}
                className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">
                {quantidades[produto.id] || 0}
              </span>
              <button
                type="button"
                onClick={() => onQuantidadeChange(produto.id, 1)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}