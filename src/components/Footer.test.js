import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  it('mostra a marca e o ano corrente', () => {
    // O ano estava fixo em 2025 e o rodapé já vivia desatualizado.
    renderFooter();
    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()} Invest Link`))
    ).toBeInTheDocument();
  });

  it('carrega o aviso de que o conteúdo não é recomendação', () => {
    // É a ressalva que precisa estar em toda página, e o rodapé é o único
    // lugar que aparece em todas.
    renderFooter();
    expect(
      screen.getByText(/não é recomendação de investimento/i)
    ).toBeInTheDocument();
  });

  it('renderiza dentro de um footer', () => {
    renderFooter();
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
