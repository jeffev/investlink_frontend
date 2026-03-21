describe('Favoritas', () => {
  beforeEach(() => {
    cy.setupMocks();
    cy.visitAuthenticated('/favoritas');
  });

  it('exibe PETR4 na lista de favoritas', () => {
    cy.contains('PETR4').should('be.visible');
  });

  it('exibe preço teto formatado em BRL', () => {
    cy.contains(/R\$.*45/).should('be.visible');
  });

  it('remove favorita e exibe confirmação de sucesso', () => {
    cy.contains('PETR4').should('be.visible');
    cy.get('button.MuiIconButton-colorError').first().click();
    cy.contains(/removida com sucesso/i).should('be.visible');
  });

  it('abre modal de edição ao clicar em Edit', () => {
    cy.contains('PETR4').should('be.visible');
    cy.get('button.MuiIconButton-colorError').first().prev('button').click();
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('botão Salvar Layout está visível', () => {
    cy.contains(/salvar layout/i).should('be.visible');
  });
});
