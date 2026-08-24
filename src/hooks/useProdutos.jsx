// src/hooks/useProdutos.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [adicionais, setAdicionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const buscarProdutos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
     
      const [resultadoProdutos, resultadoAdicionais] = await Promise.all([
        supabase
          .from('produto')
          .select('id, nome, preco, categoria, imagem_url, descricao'),
        supabase
          .from('adicionais')
          .select('id, nome, preco')
      ]);

      if (resultadoProdutos.error) throw resultadoProdutos.error;
      if (resultadoAdicionais.error) throw resultadoAdicionais.error;

      setProdutos(resultadoProdutos.data || []);
      setAdicionais(resultadoAdicionais.data || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa a busca automaticamente quando o hook é montado
  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  // Retorna os dados, estados e a função para recarregar caso precise
  return {
    produtos,
    adicionais,
    loading,
    error,
    refetch: buscarProdutos
  };
}