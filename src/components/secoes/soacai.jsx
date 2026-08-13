import './styles.css';
import ProdutoCard from '../produtoCard/ProdutoCard.jsx';
import Tradicional from '../../assets/produto/acai-tradicional.png';
import Morango from '../../assets/produto/acai-morango.png';
import Barca from '../../assets/produto/barca-acai.avif';

const listaDeAcais = [
  { id: 1, nome: "Açaí Tradicional 300ml", preco: 15.00 , imagem: Tradicional},
  { id: 2, nome: "Açaí Morango e Leite Ninho", preco: 22.00, imagem: Morango },
  { id: 3, nome: "Barca de Açaí Especial", preco: 45.00, imagem: Barca }
];

export default function SoAcai({adicionarItem}){
  return (

    <div className="produtos-container">
      <h2>Açaís</h2>
      
      <div className="lista-produtos">
        {listaDeAcais.map((acai) => (
          <ProdutoCard 
            imagem={acai.imagem}
            key={acai.id} 
            nome={acai.nome} 
            preco={acai.preco} 
            aoComprar={() => adicionarItem(acai)}
          />
        ))}
          
      </div>
    </div>
  );
}   