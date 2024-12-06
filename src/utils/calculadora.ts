import { PedidoProduto } from '../tipos';

export const calcularTotalPedido = (produtos: PedidoProduto[]): number => {
  return produtos.reduce((total, item) => {
    return total + item.produto.preco * item.quantidade;
  }, 0);
};

export const calcularTotalComanda = (pedidos: PedidoProduto[][]): number => {
  return pedidos.reduce((total, pedido) => {
    return total + calcularTotalPedido(pedido);
  }, 0);
};