import React from 'react';
import './ProdutoCard.css';
import { Button } from '../button/botao.jsx';

export default function ProdutoCard({ nome, preco, descricao, imagem, aoComprar, onAdcionar }) {
  return (
    <div className="produto-card">
      {/* Nova tag de imagem */}
      <img src={imagem} alt={`Foto de ${nome}`} className="produto-imagem" />
      
      <div className="produto-conteudo">
        <h3>{nome}</h3>
        <p>{descricao}</p>
        <strong>R$ {preco.toFixed(2)}</strong>
    
        
      </div>
      <div className="btn-adc">
        <Button onClick={aoComprar}>Adicionar ao Carrinho</Button>
      </div>
    </div>
  );
}