import './styles.css';
import ProdutoCard from '../produtoCard/ProdutoCard.jsx';
import { useProdutos } from '../../hooks/useProdutos';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function Gelatos({ adicionarItem }) {

  const { produtos, loading, error } = useProdutos();
  // 2. Trata o estado de carregamento
  if (loading) {
    return <div className="produtos-container"><p><Skeleton height={150} borderRadius={8} /></p></div>;
  }

  // Trata erros caso ocorram na busca do Supabase
  if (error) {
    return <div className="produtos-container"><p>Erro ao carregar os dados.</p></div>;
  }

const listaDeGelatos = produtos.filter((produto) => produto.categoria?.toLowerCase() === 'gelatos');




  return (

    <div className="produtos-container">
      <h2>Gelatos</h2>
      
      <div className="lista-produtos">
        {listaDeGelatos.map((gelato) => (
          <ProdutoCard 
            imagem={gelato.imagem_url}
            key={gelato.id} 
            nome={gelato.nome} 
            preco={gelato.preco} 
            descricao={gelato.descricao}
            aoComprar={() => adicionarItem(gelato)}
          />
        ))}
          
      </div>
    </div>
  );
}   