import './carrinho.css';
import React, { useState } from 'react';
import { Button } from '../../components/button/botao.jsx';
import ModalEntrega from '../../components/Modal/ModalEntrega';

export default function Carrinho({ itens = [], removerItem }) {
  // Calculando o valor total
  const valorTotal = itens.reduce((total, item) => total + item.preco, 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinalizarPedido = (dadosEntrega) => {
    
    
    alert('Pedido realizado com sucesso!');
    setIsModalOpen(false);
  };

  return (
    <div className="area-carrinho">
      <h2 className="carrinho-titulo">Seu Pedido 🛒</h2>

      {/* Se a lista estiver vazia */}
      {itens.length === 0 ? (
        <p className="carrinho-vazio">
          Seu carrinho está vazio. Volte para a vitrine e escolha um açaí! 💜
        </p>
      ) : (
        <div className="carrinho-conteudo">
          <ul className="carrinho-lista">
            {itens.map((item) => (
              <li key={item.idCarrinho} className="carrinho-item">
                <div className="item-info">
                  <strong className="item-nome">{item.nome}</strong>
                  {item.adicionais && item.adicionais.length > 0 && (
                    <small className="item-adicionais">
                      Acompanhamentos:<br /> {item.adicionais.join(', ')}
                    </small>
                  )}
                  <span className="item-preco">
                    R$ {item.preco.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removerItem(item.idCarrinho)}
                  className="btn-remover"
                  type="button"
                >
                  Remover 🗑️
                </button>
              </li>
            ))}
          </ul>

          <div className="carrinho-resumo">
            <div className="carrinho-total">
              <span>Total:</span>
              <strong>R$ {valorTotal.toFixed(2)}</strong>
            </div>

            <Button onClick={() => setIsModalOpen(true)}>
              Finalizar Compra
            </Button>

            <ModalEntrega
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                valorTotal={valorTotal}
                onSubmit={handleFinalizarPedido}
              />
    
          </div>
        </div>
      )}
    </div>
  );
}