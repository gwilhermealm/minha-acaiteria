import React from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';
import soAcai from '../../assets/imagens/SoAcai.png';
import monte from '../../assets/imagens/monte.png';
import gelatos from '../../assets/imagens/gelatos.png';

export default function Nav() {
  const navigate = useNavigate();
  return (
    <div className="nav-container">
      <nav className="navbar-SoAcai" onClick={()=> navigate('/soacai')}>
        <img src={soAcai} alt="So Acai" className="nav-image" />
      </nav>
      <nav className="navbar-monte" onClick={()=> navigate('/montador')}>
        <img src={monte} alt="Monte" className="nav-image" />
      </nav>
      <nav className="navbar-gelatos" onClick={()=> navigate('/gelatos')}>
        <img src={gelatos} alt="Gelatos" className="nav-image" />
      </nav>
    </div>
  );
}