// components/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function ProtectedRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Busca a sessão atual no Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuta mudanças na autenticação em tempo real (ex: logout, sessão expirada)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enquanto o Supabase valida o token no LocalStorage, segura a tela
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)'
      }}>
        Carregando...
      </div>
    );
  }

  // Se não estiver logado, redireciona para a tela de login
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se estiver logado, renderiza as rotas filhas (Seu AdminLayout + telas)
  return <Outlet />;
}