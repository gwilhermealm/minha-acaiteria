import React from 'react';
// Importando os componentes do Swiper React
import { Swiper, SwiperSlide } from 'swiper/react';
// Importando os módulos necessários do Swiper
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Importando os estilos do Swiper (Obrigatório)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './styles.css';

// Importando as imagens (Assets)
import Logo from '../../assets/logo-redonda.png';

import Banner1Desktop from '../../assets/banner1.png';
import Banner1Mobile from '../../assets/bannerP1.png'; 

// 3. Importe as imagens do Banner 2 (Desktop e Mobile)
import Banner2Desktop from '../../assets/banner2.png';
import Banner2Mobile from '../../assets/bannerP2.png';

export function HeroHeader() {
  
  // Lista de imagens do carrossel (para facilitar a manutenção)
 const imagensBanner = [
    { desktop: Banner1Desktop, mobile: Banner1Mobile },
    { desktop: Banner2Desktop, mobile: Banner2Mobile }
  ];
  return (
    <header className="hero-header">
      
      {/* 1. Container da Logo - Posicionada por cima do carrossel */}
      <div className="logo-container">
        <img src={Logo} alt="Logo da Açaíteria" className="logo-redonda" />
      </div>

      {/* 2. O Carrossel de Imagens */}
      <Swiper
        spaceBetween={0}        // Sem espaço entre os slides
        centeredSlides={true}  // Slide ativo no centro
        loop={true}            // Carrossel infinito
        autoplay={{
          delay: 4000,         // Passa a cada 4 segundos
          disableOnInteraction: false, // Não para se o usuário clicar
        }}
        pagination={{
          clickable: true,     // Bolinhas clicáveis
        }}
        navigation={true}      // Setas laterais
        modules={[Autoplay, Pagination, Navigation]} // Ativando os módulos
        className="mySwiper"
      >
        {imagensBanner.map((imagem, index) => (
          <SwiperSlide key={index}>
            {/* A div com background-image é melhor para controlar o corte */}
           <div className="slide-wrapper">
              
              {/* A tag <picture> faz a mágica da responsividade automática */}
              <picture>
                {/* Se a tela tiver até 768px (celular), usa a imagem mobile */}
                <source media="(max-width: 768px)" srcSet={imagem.mobile} />
                {/* Caso contrário, usa a imagem desktop normal */}
                <img src={imagem.desktop} alt="Banner Açaí" className="slide-image-img" />
              </picture>
              {/* Opcional: Adicionar um texto por cima do banner */}
              <div className="slide-overlay">
                <h2>O melhor Açaí da cidade 💜</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </header>
  );
}