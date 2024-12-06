import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ChefHat, CreditCard } from 'lucide-react';

export function Inicio() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">
        Sistema de Comanda Digital
      </h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <Link
          to="/garcom"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <Utensils size={48} className="text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Área do Garçom</h2>
          <p className="text-gray-600 text-center">
            Registre pedidos e acompanhe o status das mesas
          </p>
        </Link>

        <Link
          to="/cozinha"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChefHat size={48} className="text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Cozinha</h2>
          <p className="text-gray-600 text-center">
            Visualize e gerencie os pedidos em preparo
          </p>
        </Link>

        <Link
          to="/caixa"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <CreditCard size={48} className="text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Caixa</h2>
          <p className="text-gray-600 text-center">
            Realize cobranças e fechamento de contas
          </p>
        </Link>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              titulo: 'Registro do Pedido',
              descricao: 'O garçom registra o pedido digitalmente'
            },
            {
              titulo: 'Envio para Cozinha',
              descricao: 'Pedido é enviado instantaneamente'
            },
            {
              titulo: 'Preparo',
              descricao: 'Cozinha prepara e atualiza status'
            },
            {
              titulo: 'Fechamento',
              descricao: 'Caixa realiza cobrança integrada'
            }
          ].map((passo, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4">
                {index + 1}
              </div>
              <h3 className="font-semibold mb-2">{passo.titulo}</h3>
              <p className="text-gray-600">{passo.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}