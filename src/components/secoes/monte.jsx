import './styles.css';
import { useState } from 'react';
import ProdutoCard from '../produtoCard/ProdutoCard.jsx';
import MonteSeuAcaiModal from '../modal/index.jsx'; // Importe o modal criado
import { useProdutos } from '../../hooks/useProdutos';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';



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



    const { produtos, loading, error } = useProdutos();
  // 2. Trata o estado de carregamento
  if (loading) {
    return <div className="produtos-container"><p><Skeleton height={150} borderRadius={8} /></p></div>;
  }

  // Trata erros caso ocorram na busca do Supabase
  if (error) {
    return <div className="produtos-container"><p>Erro ao carregar os dados.</p></div>;
  }
  
  const listaDeMonte = produtos.filter((produto) => produto.categoria?.toLowerCase() === 'monte');


    return (
        <div className="produtos-container">
            <h2>Açaí do seu jeito 💜</h2>
            <div className="lista-produtos">
            {listaDeMonte.map((acai) => (
                <ProdutoCard 
                    imagem={acai.imagem_url}
                    key={acai.id}
                    nome={acai.nome}
                    preco={acai.preco}
                    descricao={acai.descricao}
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