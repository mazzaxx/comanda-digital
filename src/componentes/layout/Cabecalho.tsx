import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

export function Cabecalho() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <ClipboardList size={32} />
          <span>Comanda Digital</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/garcom" className="hover:text-blue-200">
                Garçom
              </Link>
            </li>
            <li>
              <Link to="/cozinha" className="hover:text-blue-200">
                Cozinha
              </Link>
            </li>
            <li>
              <Link to="/caixa" className="hover:text-blue-200">
                Caixa
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}