describe('Portfolio', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/portfolio');
  });

  it('exibe título Minha Carteira', () => {
    cy.contains('Minha Carteira').should('be.visible');
  });

  it('exibe resumo com Total Investido', () => {
    cy.contains('Total Investido').should('be.visible');
  });

  it('exibe posição PETR4 na tabela', () => {
    cy.contains('PETR4').should('be.visible');
  });

  it('abre modal para adicionar posição', () => {
    cy.contains(/adicionar posição/i).click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').contains(/adicionar posição/i).should('be.visible');
  });

  it('preenche e submete modal de nova posição', () => {
    cy.contains(/adicionar posição/i).click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="ticker"]').type('VALE3');
      cy.get('input[name="quantity"]').type('50');
      cy.get('input[name="average_price"]').type('60');
      cy.contains('button', 'Adicionar').click();
    });

    cy.wait('@addPosition');
    cy.contains(/adicionada com sucesso/i).should('be.visible');
  });

  it('botão Adicionar fica desabilitado com campos vazios', () => {
    cy.contains(/adicionar posição/i).click();
    cy.get('[role="dialog"]').contains('button', 'Adicionar').should('be.disabled');
  });

  it('remove posição e exibe confirmação de sucesso', () => {
    cy.contains('PETR4').should('be.visible');
    cy.get('button.MuiIconButton-colorError').first().click();
    cy.wait('@removePosition');
    cy.contains(/removida com sucesso/i).should('be.visible');
  });
});
