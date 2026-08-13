import React, { useState } from 'react';
import { FaTimes, FaMotorcycle, FaMoneyBillWave, FaCreditCard, FaQrcode } from 'react-icons/fa';
import './ModalEntrega.css';


export default function ModalEntrega({ isOpen, onClose, valorTotal, onSubmit }) {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    referencia: '',
    pagamento: 'pix', // 'pix', 'cartao', 'dinheiro'
    trocoPara: '',
  });

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
function whatsappLink(formData, valorTotal) {
    const produtos = JSON.parse(localStorage.getItem('meuCarrinhoAcai')) || [];
   
  console.log('Produtos no carrinho:', produtos); // Adicione este log para depuração
  // 2. Formata a lista de produtos em texto
  let textoProdutos = '';


  if (produtos.length > 0) {
    textoProdutos = produtos
      .map((item, index) => {
       // Verifica se a propriedade existe e se é um Array válido
        const temAdicionais = Array.isArray(item.adicionais) && item.adicionais.length > 0;
        
        const adicionais = temAdicionais
          ? `\n   └ *Acompanhamentos:* ${item.adicionais.join(', ')}`
          : '';

        // Formatação do preço garantindo tipo numérico
        const precoFormatado = Number(item.preco || 0).toFixed(2);
        return `*${index + 1}. ${item.nome}* - R$ ${precoFormatado}${adicionais}`;
      })
      .join('\n\n');
  } else {
    textoProdutos = 'Nenhum produto no carrinho.';
  }

  const numero = '5585997897202';

  // 3. Monta o texto completo organizando por seções
  const textoMensagem = 
`🍧 *NOVO PEDIDO - AÇAÍTERIA*

📋 *ITENS DO PEDIDO:*
${textoProdutos}

----------------------------------
📍 *DADOS DE ENTREGA:*
• *Nome:* ${formData.nome}
• *Telefone:* ${formData.telefone}
• *Endereço:* ${formData.rua}, Nº ${formData.numero}
• *Bairro:* ${formData.bairro}
• *Ponto de Ref.:* ${formData.referencia || 'Não informado'}

💳 *PAGAMENTO:*
• *Forma:* ${formData.pagamento.toUpperCase()}${formData.pagamento === 'dinheiro' ? ` (Troco para: R$ ${formData.trocoPara})` : ''}

💰 *TOTAL DO PEDIDO:* R$ ${valorTotal.toFixed(2)}`;

  // 4. Codifica o texto para ser usado na URL do WhatsApp
  const mensagemEncoded = encodeURIComponent(textoMensagem);

  return `https://wa.me/${numero}?text=${mensagemEncoded}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia os dados para a função do componente pai
    onSubmit(formData);

  const urlWhatsApp = whatsappLink();
  window.open(urlWhatsApp, '_blank');
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho do Modal */}
        <div className="modal-header">
          <h3>
            <FaMotorcycle style={{ marginRight: '8px' }} />
            Dados para Entrega
          </h3>
          <button className="btn-fechar" onClick={onClose} type="button">
            <FaTimes />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nome">Seu Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              placeholder="Ex: Guilherme Silva"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">WhatsApp / Telefone *</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              required
              placeholder="(85) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-3">
              <label htmlFor="rua">Rua / Avenida *</label>
              <input
                type="text"
                id="rua"
                name="rua"
                required
                placeholder="Ex: Rua das Flores"
                value={formData.rua}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="numero">Nº *</label>
              <input
                type="text"
                id="numero"
                name="numero"
                required
                placeholder="123"
                value={formData.numero}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro *</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              required
              placeholder="Ex: Centro"
              value={formData.bairro}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="referencia">Ponto de Referência (Opcional)</label>
            <input
              type="text"
              id="referencia"
              name="referencia"
              placeholder="Ex: Próximo à farmácia"
              value={formData.referencia}
              onChange={handleChange}
            />
          </div>

          {/* Forma de Pagamento */}
          <div className="form-group">
            <label>Forma de Pagamento *</label>
            <div className="pagamento-options">
              <label className={`pagamento-card ${formData.pagamento === 'pix' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value="pix"
                  checked={formData.pagamento === 'pix'}
                  onChange={handleChange}
                />
                <FaQrcode size={18} />
                <span>Pix</span>
              </label>

              <label className={`pagamento-card ${formData.pagamento === 'cartao' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value="cartao"
                  checked={formData.pagamento === 'cartao'}
                  onChange={handleChange}
                />
                <FaCreditCard size={18} />
                <span>Cartão</span>
              </label>

              <label className={`pagamento-card ${formData.pagamento === 'dinheiro' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value="dinheiro"
                  checked={formData.pagamento === 'dinheiro'}
                  onChange={handleChange}
                />
                <FaMoneyBillWave size={18} />
                <span>Dinheiro</span>
              </label>
            </div>
          </div>

          {/* Campo extra se for dinheiro */}
          {formData.pagamento === 'dinheiro' && (
            <div className="form-group">
              <label htmlFor="trocoPara">Precisa de troco para quanto?</label>
              <input
                type="text"
                id="trocoPara"
                name="trocoPara"
                placeholder={`Ex: R$ ${(valorTotal + 10).toFixed(2)}`}
                value={formData.trocoPara}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Resumo e Botão de Envio */}
          <div className="modal-footer">
            <div className="total-modal">
              <span>Total com entrega:</span>
              <strong>R$ {valorTotal.toFixed(2)}</strong>
            </div>

            <button type="submit" className="btn-confirmar" >
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}