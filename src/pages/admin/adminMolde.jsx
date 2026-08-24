import { Link, useLocation , Outlet} from 'react-router-dom';
import { BiStore, BiGridAlt, BiRestaurant, BiBarChartAlt2, BiHelpCircle, BiLogOut } from 'react-icons/bi';
import './admin.css';
import { supabase } from '../../supabaseClient';


export default function AdminLayout() {
  const location = useLocation();
  const adminLogout = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do link
    
    // 1. Faz o logout oficial no Supabase (limpa tokens e encerra a sessão na memória)
    await supabase.auth.signOut(); 
    
    // 2. Redireciona o usuário para a tela de login
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout-container">
      {/* 1. BARRA DE NAVEGAÇÃO FIXA (SIDEBAR) */}
      <aside className="admin-sidebar">
        <div>
          {/* Marca / Topo da Sidebar */}
          <div className="sidebar-header">
            <BiStore className="sidebar-logo-icon" />
            <div className="sidebar-brand">
              <h1>Minha Açaiteria</h1>
              <span>Management Hub</span>
            </div>
          </div>

          {/* Links do Menu */}
          <nav className="sidebar-nav">
            <Link 
              to="/admin/orders" 
              className={`sidebar-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}
            >
              <BiGridAlt /> Gerenciador de Pedidos
            </Link>

            <Link 
              to="/admin/menu" 
              className={`sidebar-link ${location.pathname === '/admin/menu' ? 'active' : ''}`}
            >
              <BiRestaurant /> Cardápio
            </Link>

            <Link 
              to="/admin/dashboard" 
              className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              <BiBarChartAlt2 /> Dashboard
            </Link>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="sidebar-footer">
          <Link to="/admin/suporte" className="sidebar-link">
            <BiHelpCircle /> Suporte
          </Link>
          <a href="/admin/login" className="sidebar-link" onClick={adminLogout}>
            <BiLogOut /> Sair
          </a>
        </div>
      </aside>

      {/* Área onde as páginas (Orders, Menu, Dashboard) serão renderizadas */}
      <main className="admin-main">
        <Outlet />
     
      </main>
    </div>
  );
}