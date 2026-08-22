import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
//import protectedRoute from './components/rotas/protecaoRotas.jsx';
// Importações de ícones
import { FaShoppingCart } from 'react-icons/fa';
import { BsGridFill, BsGrid } from 'react-icons/bs';
import { FaPhoneAlt } from 'react-icons/fa';

import Vitrine from './pages/home/vitrineAcai.jsx';
import Contato from './pages/contato/contato.jsx';
import Carrinho from './pages/cart/carrinho.jsx';
import { HeroHeader } from './components/HeroHeader/index.jsx';
import  InfoCard from './components/infoCard/index.jsx';



import SoAcai from './components/secoes/soacai.jsx'; // ou o caminho exato onde está
import Monte from './components/secoes/monte.jsx';
import Gelatos from './components/secoes/gelatos.jsx';



// 2. IMPORTAÇÃO DO LAYOUT E PÁGINAS ADMINISTRATIVAS
import AdminLayout from "./pages/admin/adminMolde.jsx";// ajuste o caminho da pasta se necessário
import Orders from './pages/admin/orders';
import Menu from './pages/admin/menu';
import Dashboard from './pages/admin/dashboard';
import Login from './pages/admin/login.jsx';
import ProtectedRoute from './components/rotas/protecaoRotas.jsx';

import './App.css';
import './index.css'; // Certifique-se de que o caminho está correto
import Navegacao from './components/nav/index.jsx';
function AppContent() {
  // 1. Iniciando o estado já buscando do localStorage (se existir)
  const [itensCarrinho, setItensCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('meuCarrinhoAcai');
    // Se tiver algo salvo, transforma de volta em lista. Se não, começa vazio []
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  // 2. Efeito colateral: Toda vez que 'itensCarrinho' mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem('meuCarrinhoAcai', JSON.stringify(itensCarrinho));
  }, [itensCarrinho]); // O React fica "vigiando" essa variável

  // 3. Função para adicionar um novo item
  const adicionarAoCarrinho = (novoAcai) => {
    // Criamos um ID único para este item no carrinho (útil para remover depois)
    const itemComIdUnico = { ...novoAcai, idCarrinho: Date.now() };
    
    setItensCarrinho([...itensCarrinho, itemComIdUnico]);
    alert(`${novoAcai.nome} foi adicionado ao carrinho! 🛒`);
  };
  // Função para remover um item específico
  const removerDoCarrinho = (idParaRemover) => {
    // O filter vai manter todo mundo, EXCETO o item que tem o id igual ao idParaRemover
    const carrinhoAtualizado = itensCarrinho.filter((item) => item.idCarrinho !== idParaRemover);
    
    // Atualiza o estado com a nova lista (o useEffect já vai salvar no localStorage automaticamente!)
    setItensCarrinho(carrinhoAtualizado);
  };

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ margin: 0, padding: 0 }}>
        

        
       {!isAdminRoute && (
        <>
          <HeroHeader />
          <InfoCard />
          <Navegacao />
          <nav className="navbar">
            <Link to="/"> <BsGridFill /> </Link> | 
            <Link to="/carrinho"> <FaShoppingCart /> ({itensCarrinho.length})</Link> | 
            <Link to="/contato"> <FaPhoneAlt /> Contato</Link>
          </nav>
        </>
      )}
  

      <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Vitrine categoria="todos" adicionarItem={adicionarAoCarrinho} />} />
      <Route path="/soacai" element={<SoAcai adicionarItem={adicionarAoCarrinho} />} />
      <Route path="/montador" element={<Monte adicionarItem={adicionarAoCarrinho} />} />
      <Route path="/gelatos" element={<Gelatos adicionarItem={adicionarAoCarrinho} />} />

      {/* Demais rotas */}
      <Route path="/carrinho" element={<Carrinho itens={itensCarrinho} removerItem={removerDoCarrinho} />} />
      <Route path="/contato" element={<Contato />} />

      {/* 🟡 ROTA PÚBLICA DE LOGIN DO ADMIN */}
      <Route path="/admin/login" element={<Login />} />

      {/* 🟢 ROTAS ADMINISTRATIVAS ANINHADAS */}
    <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Orders />} /> 
      <Route path="orders" element={<Orders />} />
      <Route path="menu" element={<Menu />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Route>
    </Route>
    </Routes>
      </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}