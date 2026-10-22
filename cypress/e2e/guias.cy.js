describe('Guias', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/guias');
  });

  it('exibe o hub com as duas trilhas', () => {
    cy.contains('h4', 'Guias').should('be.visible');
    cy.contains('Como usar o InvestLink').should('be.visible');
    cy.contains('Aprender a investir').should('be.visible');
  });

  it('abre um guia e mostra o conteúdo', () => {
    cy.contains('Valuation').click();
    cy.url().should('include', '/guias/');
    cy.contains(/Graham/).should('be.visible');
  });

  it('o guia de valuation descreve a fórmula de Graham com a ressalva', () => {
    // O conteúdo é a parte que faz o app ser usável por iniciante; se ele
    // sumir, ninguém percebe sem um teste. A seção vem recolhida.
    cy.visitAuthenticated('/guias/valuation');
    cy.contains('.MuiAccordionSummary-root', /Formula de Graham/i).click();

    cy.contains(/22,5/).should('be.visible');
    // A ressalva importa tanto quanto a fórmula: Graham não vale para empresa
    // com prejuízo, e é isso que impede o leitor de aplicá-la onde não deve.
    cy.contains(/preju[ií]zo/i).should('be.visible');
  });

  it('volta do guia para o hub', () => {
    cy.visitAuthenticated('/guias/valuation');
    cy.go('back');
    cy.contains('Como usar o InvestLink').should('be.visible');
  });
});
