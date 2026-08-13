import './style.css';

// Esse { children, onClick } são as propriedades (props) que o botão vai receber
export function Button({ children, onClick }) {
  return (
    <button className="botao-padrao" onClick={onClick}>
      {children}
    </button>
  );
}