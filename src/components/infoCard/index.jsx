import './styles.css';

export default function InfoCard() {
  const horaAtual = new Date().getHours();
  const estaAberto = horaAtual >= 10 && horaAtual < 22;

  const statusTexto = estaAberto ? "Aberto Agora 🟢" : "Fechado no Momento 🔴";
  return (
    <div className="info-card">
      <h2 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>Informações</h2>
      <p>Horário de Funcionamento: 10:00 - 22:00</p>
      <p>Status: <strong>{statusTexto}</strong></p>
      <span className="info-card-text">Endereço: Rua das Flores, 123 - Cidade, Estado</span>
    </div>
  );

}


   



