import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './menu.css';
import './admin.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GestaoCardapio() {
  // Estado para o formulário de Produtos
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: '',
    imagem_url: '',
    categoria: ''
  });

  // Estados para renderizar e alterar preço dos produtos
  const [produtos, setProdutos] = useState([]);
  const [adicionais, setAdicionais] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [novoPreco, setNovoPreco] = useState(''); // <--- NOVO ESTADO
  const [loading, setLoading] = useState(true);
  const [loadingPreco, setLoadingPreco] = useState(false); // <--- NOVO ESTADO PARA SPINNER/BUTTON

  // Função isolada para recarregar a lista de produtos (reutilizável)
  const buscarProdutos = async () => {
    try {
      setLoading(true);
      const [resultadoProdutos, resultadoAdicionais] = await Promise.all([
        supabase
          .from('produto')
          .select('id, nome, preco'),
        supabase
          .from('adicionais')
          .select('id, nome, preco')
      ]);

      if (resultadoProdutos.error) throw resultadoProdutos.error;
      if (resultadoAdicionais.error) throw resultadoAdicionais.error;

      setProdutos(resultadoProdutos.data || []);
      setAdicionais(resultadoAdicionais.data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  // Função auxiliar formatar moeda 
  const formatarMoeda = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Seleciona um produto ou adicional e preenche o preço atual.
  const handleProdutoChange = (e) => {
    const [tipo, id] = e.target.value.split(':');
    setProdutoSelecionado(e.target.value);

    const lista = tipo === 'adicional' ? adicionais : produtos;
    const itemEncontrado = lista.find((item) => String(item.id) === id);
    if (itemEncontrado) {
      setNovoPreco(itemEncontrado.preco);
    } else {
      setNovoPreco('');
    }
  };

  // --- NOVA FUNÇÃO: SALVAR PREÇO NOVO NO SUPABASE ---
  const handleAtualizarPreco = async (e) => {
    e.preventDefault();

    if (!produtoSelecionado || !novoPreco) {
      exibirMensagem('erro', 'Selecione um produto e informe o novo preço.');
      return;
    }

    try {
      setLoadingPreco(true);

      const [tipo, id] = produtoSelecionado.split(':');
      const tabela = tipo === 'adicional' ? 'adicionais' : 'produto';
      const { data, error } = await supabase
        .from(tabela)
        .update({ preco: parseFloat(novoPreco) })
        .eq('id', id)
        .select();

      if (error) throw error;

      // Se 'data' for um array vazio, a política do banco (RLS) bloqueou o UPDATE silenciosamente
      if (!data || data.length === 0) {
        throw new Error('O banco de dados não permitiu alterar o preço. Verifique se o RLS (Políticas de Segurança) está ativo no Supabase.');
      }

      exibirMensagem('sucesso', 'Preço alterado com sucesso!');
      
      setProdutoSelecionado('');
      setNovoPreco('');
      await buscarProdutos();

    } catch (error) {
      exibirMensagem('erro', `Erro ao atualizar preço: ${error.message}`);
    } finally {
      setLoadingPreco(false);
    }
  };

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

  // --- UPLOAD PARA O SUPABASE STORAGE ---
  const fazerUploadImagem = async (arquivo) => {
    try {
      const nomeArquivo = `${Date.now()}_${arquivo.name}`;
      
      const { uploadError } = await supabase
        .storage
        .from('imagens-produtos')
        .upload(nomeArquivo, arquivo, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase
        .storage
        .from('imagens-produtos')
        .getPublicUrl(nomeArquivo);

      return publicUrlData.publicUrl;

    } catch (error) {
      console.error('Erro no upload:', error.message);
      return null;
    }
  };

  // --- HANDLER PARA SALVAR PRODUTO ---
  const handleSalvarProduto = async (e) => {
    e.preventDefault();
    setLoadingProduto(true);
    let urlDaImagemFinal = null;

    if (arquivoImagem) {
      exibirMensagem('sucesso', 'Fazendo upload da imagem...');
      urlDaImagemFinal = await fazerUploadImagem(arquivoImagem);
      
      if (!urlDaImagemFinal) {
        exibirMensagem('erro', 'Falha no upload da imagem. O produto não foi salvo.');
        setLoadingProduto(false);
        return;
      }
    }

    const { error: insertError } = await supabase.from('produto').insert([
      {
        nome: produto.nome,
        preco: parseFloat(produto.preco),
        descricao: produto.descricao,
        categoria: produto.categoria,
        imagem_url: urlDaImagemFinal
      }
    ]);

    setLoadingProduto(false);

    if (insertError) {
      exibirMensagem('erro', `Erro ao salvar produto: ${insertError.message}`);
    } else {
      exibirMensagem('sucesso', 'Produto e imagem cadastrados com sucesso!');
      setProduto({ nome: '', preco: '', descricao: '', imagem_url: '', categoria: '' });
      setArquivoImagem(null); 
      document.getElementById('inputImagem').value = '';
      await buscarProdutos(); // Atualiza a lista do select também ao criar um produto novo
    }
  };

  // Handler para salvar Adicional
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

            <div className="grupo-input">
              <label>Imagem do Produto (Arquivo)</label>
              <input
                id="inputImagem"
                type="file"
                accept="image/*"
                onChange={(e) => setArquivoImagem(e.target.files[0])}
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

        {/* CARD 3: ALTERAR PREÇOS */}
        <section className="card-cadastro">
          <h2 className="card-titulo">Alterar Preços</h2>
          <form onSubmit={handleAtualizarPreco} className="form-cadastro">
            <div className="grupo-input">
              <label>Produto</label>  
              <select value={produtoSelecionado} onChange={handleProdutoChange} disabled={loading}>
                <option value="">
                  {loading ? 'Carregando produtos...' : 'Selecione um produto'}
                </option>
                {produtos.map((p) => (
                  <option key={`produto-${p.id}`} value={`produto:${p.id}`}>
                    {p.nome} - {formatarMoeda(p.preco)}
                  </option>
                ))}
                <option value="">
                     {loading ? 'carregando adicionais...': '---adicionais---'}
                </option>
               {adicionais.map((a)=> (
                    <option key={`adicional-${a.id}`} value={`adicional:${a.id}`}>
                      {a.nome} - {formatarMoeda(a.preco)}
                    </option>
               ))}
              </select>
            </div>
            <div className="grupo-input">
              <label>Novo Preço (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                required
                value={novoPreco}
                onChange={(e) => setNovoPreco(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loadingPreco || !produtoSelecionado} className="btn-salvar">
              {loadingPreco ? 'Atualizando...' : 'Alterar Preço'}
            </button>
          </form>
        </section>
      </div>
    </div>    
  );
}