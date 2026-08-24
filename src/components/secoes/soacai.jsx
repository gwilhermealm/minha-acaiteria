import './styles.css';
import ProdutoCard from '../produtoCard/ProdutoCard.jsx';
import { useProdutos } from '../../hooks/useProdutos';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


export default function SoAcai({adicionarItem}){


    const { produtos, loading, error } = useProdutos();
  // 2. Trata o estado de carregamento
  if (loading) {
    return <div className="produtos-container"><p><Skeleton height={150} borderRadius={8} /></p></div>;
  }

  // Trata erros caso ocorram na busca do Supabase
  if (error) {
    return <div className="produtos-container"><p>Erro ao carregar os dados.</p></div>;
  }
 const listaAcai = produtos.filter((produto) => produto.categoria?.toLowerCase() === 'acai');


  return (

    <div className="produtos-container">
      <h2>Açaís</h2>
      
      <div className="lista-produtos">
        {listaAcai.map((acai) => (
          <ProdutoCard 
            imagem={acai.imagem_url}
            key={acai.id} 
            nome={acai.nome} 
            preco={acai.preco} 
            descricao={acai.descricao}
            aoComprar={() => adicionarItem(acai)}
          />
        ))}
          
      </div>
    </div>
  );
}   