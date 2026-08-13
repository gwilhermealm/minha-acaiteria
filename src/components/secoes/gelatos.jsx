import './styles.css';
import ProdutoCard from '../produtoCard/ProdutoCard.jsx';
import Creme from '../../assets/produto/gelato-creme.png';
import Morango from '../../assets/produto/gelato-morango.png';
import Barca from '../../assets/produto/gelato-chocolate.png';

const listaDeGelatos = [
  { id: 1, nome: "Gelato de Creme", preco: 12.00, imagem: Creme },
  { id: 2, nome: "Gelato de Morango", preco: 13.00, imagem: Morango },
  { id: 3, nome: "Gelato de Chocolate", preco: 14.00, imagem: Barca }
];

export default function Gelatos({ adicionarItem }) {
  return (

    <div className="produtos-container">
      <h2>Gelatos</h2>
      
      <div className="lista-produtos">
        {listaDeGelatos.map((gelato) => (
          <ProdutoCard 
            imagem={gelato.imagem}
            key={gelato.id} 
            nome={gelato.nome} 
            preco={gelato.preco} 
            aoComprar={() => adicionarItem(gelato)}
          />
        ))}
          
      </div>
    </div>
  );
}   