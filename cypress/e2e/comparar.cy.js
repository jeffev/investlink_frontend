describe('Comparar ativos', () => {
  beforeEach(() => {
    cy.setupMocks();
  });

  it('exibe o título e pede a seleção', () => {
    cy.visitAuthenticated('/comparar');
    cy.contains('Comparar Ativos').should('be.visible');
    cy.contains(/Selecione até 5 ativos/).should('be.visible');
  });

  it('carrega os tickers já selecionados pela URL', () => {
    // A URL é o estado da comparação — é o que torna o link compartilhável.
    cy.visitAuthenticated('/comparar?tickers=PETR4,VALE3');
    cy.wait('@getBulkStocks');

    cy.contains('.MuiChip-root', 'PETR4').should('be.visible');
    cy.contains('.MuiChip-root', 'VALE3').should('be.visible');
  });

  it('monta a tabela comparativa com os indicadores', () => {
    cy.visitAuthenticated('/comparar?tickers=PETR4,VALE3');
    cy.wait('@getBulkStocks');

    cy.contains('Indicador').should('be.visible');
    cy.contains('P/L').should('be.visible');
    cy.contains('Desconto Graham').should('be.visible');
  });

  it('remove um ativo da comparação', () => {
    cy.visitAuthenticated('/comparar?tickers=PETR4,VALE3');
    cy.wait('@getBulkStocks');

    cy.contains('.MuiChip-root', 'VALE3').find('svg').click();

    cy.contains('.MuiChip-root', 'VALE3').should('not.exist');
    cy.url().should('not.include', 'VALE3');
  });

  it('adiciona um ativo pela busca', () => {
    cy.visitAuthenticated('/comparar');
    cy.wait('@getStocks');

    cy.get('input[role="combobox"]').type('PETR');
    cy.contains('li', 'PETR4').click();

    cy.contains('.MuiChip-root', 'PETR4').should('be.visible');
    cy.url().should('include', 'tickers=PETR4');
  });
});
