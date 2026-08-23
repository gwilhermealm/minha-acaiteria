import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './menu.css';
import './admin.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifique se tem o "export" aqui na frente:
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Inicialização do cliente Supabase
export default function GestaoCardapio() {
  // Estado para o formulário de Produtos (imagem_url começa vazia)
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: '',
    imagem_url: '',
    categoria: '' // Esta será preenchida após o upload no Storage
  });

  // Novo estado para guardar o arquivo de imagem selecionado ANTES do envio
  const [arquivoImagem, setArquivoImagem] = useState(null);

  // Estados para o formulário de Adicionais
  const [adicional, setAdicional] = useState({ nome: '', preco: '' });

  // Estados de feedback visual
  const [loadingProduto, setLoadingProduto] = useState(false);
  const [loadingAdicional, setLoadingAdicional] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const exibirMensagem = (tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: '', texto: '' }), 5000);
  };

  // --- NOVA FUNÇÃO: UPLOAD PARA O SUPABASE STORAGE ---
  const fazerUploadImagem = async (arquivo) => {
    try {
      // 1. Define um nome único para o arquivo (ex: timestamp_nomeoriginal.png)
      const nomeArquivo = `${Date.now()}_${arquivo.name}`;
      
      // 2. Faz o upload para o bucket 'imagens-produtos' (você precisa criar este bucket no Supabase)
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('imagens-produtos') // NOME DO SEU BUCKET
        .upload(nomeArquivo, arquivo, {
          cacheControl: '3600',
          upsert: false // Não sobrescreve arquivos existentes
        });

      if (uploadError) throw uploadError;

      // 3. Pega a URL pública do arquivo recém-criado
      const { data: publicUrlData } = supabase
        .storage
        .from('imagens-produtos')
        .getPublicUrl(nomeArquivo);

      return publicUrlData.publicUrl; // Retorna a URL pronta para salvar na tabela

    } catch (error) {
      console.error('Erro no upload:', error.message);
      return null;
    }
  };

  // --- HANDLER PARA SALVAR PRODUTO (MODIFICADO) ---
  const handleSalvarProduto = async (e) => {
    e.preventDefault();
    setLoadingProduto(true);
    let urlDaImagemFinal = null;

    // 1. Se houver um arquivo de imagem selecionado, faz o upload primeiro
    if (arquivoImagem) {
      exibirMensagem('sucesso', 'Fazendo upload da imagem...');
      urlDaImagemFinal = await fazerUploadImagem(arquivoImagem);
      
      if (!urlDaImagemFinal) {
        exibirMensagem('erro', 'Falha no upload da imagem. O produto não foi salvo.');
        setLoadingProduto(false);
        return; // Interrompe se o upload falhar
      }
    }

    // 2. Salva o produto na tabela 'produto', usando a URL gerada (se houver)
    const { error: insertError } = await supabase.from('produto').insert([
      {
        nome: produto.nome,
        preco: parseFloat(produto.preco),
        descricao: produto.descricao,
        categoria: produto.categoria,
        imagem_url: urlDaImagemFinal // Salva a URL pública do Storage
      }
    ]);

    setLoadingProduto(false);

    if (insertError) {
      exibirMensagem('erro', `Erro ao salvar produto: ${insertError.message}`);
    } else {
      exibirMensagem('sucesso', 'Produto e imagem cadastrados com sucesso!');
      // Limpa os estados
      setProduto({ nome: '', preco: '', descricao: '', imagem_url: '', categoria: '' });
      setArquivoImagem(null); 
      // Limpa o input de arquivo manualmente (referência nativa seria melhor, mas isso funciona)
      document.getElementById('inputImagem').value = '';
    }
  };

  // Handler para salvar Adicional (sem alterações)
  const handleSalvarAdicional = async (e) => {
    e.preventDefault();
    setLoadingAdicional(true);
    const { error } = await supabase.from('adicionais').insert([
      { nome: adicional.nome, preco: parseFloat(adicional.preco) }
    ]);
    setLoadingAdicional(false);
    if (error) {
      exibirMensagem('erro', `Erro ao salvar adicional: ${error.message}`);
    } else {
      exibirMensagem('sucesso', 'Adicional cadastrado com sucesso!');
      setAdicional({ nome: '', preco: '' });
    }
  };

  return (
    <div className="gestao-container">
      {mensagem.texto && <div className={`alerta ${mensagem.tipo}`}>{mensagem.texto}</div>}

      <header className="gestao-header">
        <h1 className="gestao-titulo">Gestão de Cardápio</h1>
        <p className="gestao-subtitulo">Cadastre os itens da sua açaiteria</p>
      </header>

      <div className="gestao-grid">
        {/* CARD 1: CADASTRO DE PRODUTOS */}
        <section className="card-cadastro">
          <h2 className="card-titulo">Novo Produto</h2>
          <form onSubmit={handleSalvarProduto} className="form-cadastro">
            <div className="grupo-input">
              <label>Nome do Produto</label>
              <input type="text" required placeholder="Ex: Açaí Monte o Seu 500ml" value={produto.nome} onChange={(e) => setProduto({ ...produto, nome: e.target.value })} />
            </div>

            <div className="grupo-input">
              <label htmlFor="categoria">Categoria:</label>
              <select
                id="categoria"
                required
                value={produto.categoria}
                onChange={(e) => setProduto({ ...produto, categoria: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                <option value="acai">Açaí</option>
                <option value="monte">Monte</option>
                <option value="gelatos">Gelatos</option>
              </select>
            </div>


            <div className="grupo-input">
              <label>Preço (R$)</label>
              <input type="number" step="0.01" required placeholder="18.00" value={produto.preco} onChange={(e) => setProduto({ ...produto, preco: e.target.value })} />
            </div>

            {/* --- NOVO INPUT DE ARQUIVO --- */}
            <div className="grupo-input">
              <label>Imagem do Produto (Arquivo)</label>
              <input
                id="inputImagem"
                type="file"
                accept="image/*" // Aceita apenas imagens
                onChange={(e) => setArquivoImagem(e.target.files[0])} // Captura o arquivo[0]
              />
            </div>

            <div className="grupo-input">
              <label>Descrição</label>
              <textarea rows="3" placeholder="Descreva o produto, tamanhos..." value={produto.descricao} onChange={(e) => setProduto({ ...produto, descricao: e.target.value })} />
            </div>

            <button type="submit" disabled={loadingProduto} className="btn-salvar">
              {loadingProduto ? 'Processando...' : 'Cadastrar Produto'}
            </button>
          </form>
        </section>

        {/* CARD 2: CADASTRO DE ADICIONAIS */}
        <section className="card-cadastro">
          <h2 className="card-titulo">Novo Adicional</h2>
          <form onSubmit={handleSalvarAdicional} className="form-cadastro">
            <div className="grupo-input">
              <label>Nome do Adicional</label>
              <input type="text" required placeholder="Ex: Leite em Pó" value={adicional.nome} onChange={(e) => setAdicional({ ...adicional, nome: e.target.value })} />
            </div>
            <div className="grupo-input">
              <label>Preço Extra (R$)</label>
              <input type="number" step="0.01" required placeholder="0.00" value={adicional.preco} onChange={(e) => setAdicional({ ...adicional, preco: e.target.value })} />
            </div>
            <button type="submit" disabled={loadingAdicional} className="btn-salvar">
              {loadingAdicional ? 'Salvando...' : 'Cadastrar Adicional'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}