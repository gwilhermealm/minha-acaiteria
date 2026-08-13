
function Whatsapp() {

    const numero = "5585997897202"
    const mensagem = encodeURIComponent("Olá! Gostaria de tirar uma dúvida sobre os açaís.");
    const linkWhatsApp = `https://wa.me/${numero}?text=${mensagem}`;
    return (
        <div>
           <h2>ir para whatsapp </h2>
           <a href={linkWhatsApp}
           target="_blank" 
           rel="noopener noreferrer" // Isso é uma recomendação de segurança do React
            style={{
          display: 'inline-block',
          backgroundColor: '#25D366', // A cor verdinha do WhatsApp
          color: 'white',
          padding: '10px 20px',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>abrir whatsapp</a>
        </div>
         
        
    )


} 
export default Whatsapp;