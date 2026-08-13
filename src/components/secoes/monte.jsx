import './styles.css';
import { useState } from 'react';
import ProdutoCard from '../produtoCard/ProdutoCard.jsx';
import MonteSeuAcaiModal from '../modal/index.jsx'; // Importe o modal criado


import P from '../../assets/produto/copo-300ml.jpg';
import M from '../../assets/produto/copo-500ml.png';
import G from '../../assets/produto/copo-700ml.png';
const listaDeAcais = [
  { id: 1, nome: "Copo 300ml", preco: 15.00, imagem: P },
  { id: 2, nome: "Copo 500ml", preco: 20.00, imagem: M },
  { id: 3, nome: "Copo Mostrão 700ml", preco: 45.00, imagem: G }
];

function MontadorAcai({ adicionarItem }) {
  const [acaiSelecionado, setAcaiSelecionado] = useState(null);

  const handleAbrirModal = (acai) => {
    setAcaiSelecionado(acai);
  };
  
  const handleFecharModal = () => {
    setAcaiSelecionado(null);
  };

  const handleFinalizarPedido = (pedidoCompleto) => {
    console.log("Pedido pronto para o carrinho:", pedidoCompleto);
    const pedidoComId = {
      ...pedidoCompleto,
      idCarrinho: Date.now()
    };

    adicionarItem(pedidoComId); // Adiciona o pedido ao carrinho
    // Aqui você envia o pedido para o carrinho global
    handleFecharModal();
  };

    return (
        <div className="produtos-container">
            <h2>Açaí do seu jeito 💜</h2>
            <div className="lista-produtos">
            {listaDeAcais.map((acai) => (
                <ProdutoCard 
                    imagem={acai.imagem}
                    key={acai.id}
                    nome={acai.nome}
                    preco={acai.preco}
                    aoComprar={() => handleAbrirModal(acai)}
                />
            ))}
            </div>

            <MonteSeuAcaiModal 
          acaiBase={acaiSelecionado}
          onClose={handleFecharModal}
          onConfirmar={handleFinalizarPedido}
        />
        </div>
    );
}

export default MontadorAcai;