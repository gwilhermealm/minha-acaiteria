import React, { useState } from 'react';
import './styles.css';

export default function MonteSeuAcaiModal({ acaiBase, onClose, onConfirmar }) {
  const [adicionais, setAdicionais] = useState([]);
  
  if (!acaiBase) return null;

  // Opções de complementos (pode vir de um mock ou API)
  const opcoesAdicionais = ['Leite em Pó', 'Granola', 'Banana', 'Morango', 'Leite Condensado', 'Paçoca'];

  const handleAdicionalChange = (item) => {
    if (adicionais.includes(item)) {
      setAdicionais(adicionais.filter((i) => i !== item));
    } else {
      if (adicionais.length < 3) {
        setAdicionais([...adicionais, item]);
      } else {
        alert('Você já escolheu o limite de 3 adicionais!');
      }
    }
  };

  const handleConfirmar = () => {
    // Junta o açaí base com os adicionais escolhidos
    const itemFinal = {
      ...acaiBase,
      adicionais,
    };
    onConfirmar(itemFinal);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Personalize seu {acaiBase.nome}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <p className="preco-base">Base: <strong>R$ {acaiBase.preco.toFixed(2)}</strong></p>
          
          <h3>Escolha até 3 adicionais inclusos:</h3>
          <div className="adicionais-grid">
            {opcoesAdicionais.map((item) => (
              <label key={item} className="opcao-label">
                <input
                  type="checkbox"
                  checked={adicionais.includes(item)}
                  onChange={() => handleAdicionalChange(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-confirmar" onClick={handleConfirmar}>
            Confirmar e Adicionar (R$ {acaiBase.preco.toFixed(2)})
          </button>
        </div>

      </div>
    </div>
  );
}