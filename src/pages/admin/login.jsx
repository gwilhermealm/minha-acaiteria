import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import './admin.css';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage('E-mail ou senha inválidos. Tente novamente.');
    } else {
      window.location.href = '/admin';
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* Efeitos Glow no Fundo */}
      <div className="glow-top-left"></div>
      <div className="glow-bottom-right"></div>

      {/* Card do Formulário */}
      <div className="login-card">
        
        <div className="login-header">
          <div className="icon-wrapper">
            <Lock size={26} />
          </div>
          <h1 className="login-title">Painel Gerenciador</h1>
          <p className="login-subtitle">Entre com suas credenciais para continuar</p>
        </div>

        {errorMessage && (
          <div className="error-alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          Acesso restrito a administradores
        </div>
      </div>
    </div>
  );
}