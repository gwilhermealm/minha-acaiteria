

import SoAcai from '../../components/secoes/soacai.jsx';
import Gelatos from '../../components/secoes/gelatos.jsx';
import MontadorAcai from '../../components/secoes/monte.jsx';
import './styles.css';
export default function Vitrine({ adicionarItem }) {
 
  return (
    <div className="vitrine-container">
      <SoAcai adicionarItem={adicionarItem} />

      <hr />

      <div className="area-montador">
        
        <MontadorAcai adicionarItem={adicionarItem} />
      </div>

      <hr />

      <Gelatos adicionarItem={adicionarItem} />
    </div>
  );
}
