const FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxIiwicHJvZmlsZSI6IlVTRVIiLCJleHAiOjk5OTk5OTk5OTl9' +
  '.fake';

describe('Registro', () => {
  it('cadastro com dados válidos sai da página de registro', () => {
    cy.intercept('POST', '**/v1/users', {
      statusCode: 201,
      body: {
        access_token: FAKE_TOKEN,
        refresh_token: 'fake_refresh_token',
        profile: 'USER',
        name: 'Novo Usuário',
        user_name: 'novousuario',
      },
    }).as('register');

    cy.intercept('GET', '**/v1/user_layout/**', { statusCode: 404, body: {} });

    cy.visit('/registrar');
    cy.get('input[name="name"]').type('Novo Usuário');
    cy.get('input[name="user"]').type('novousuario');
    cy.get('input[name="email"]').type('novo@example.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.wait('@register');
    cy.url().should('not.include', '/registrar');
  });

  it('cadastro com usuário já existente exibe mensagem de erro', () => {
    cy.intercept('POST', '**/v1/users', {
      statusCode: 409,
      body: { message: 'Usuário já existe' },
    }).as('registerFail');

    cy.visit('/registrar');
    cy.get('input[name="name"]').type('Admin');
    cy.get('input[name="user"]').type('admin');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerFail');
    cy.get('[role="alert"]').should('be.visible');
  });

  it('link "Já possui uma conta?" navega para /login', () => {
    cy.visit('/registrar');
    cy.contains('Já possui uma conta').click();
    cy.url().should('include', '/login');
  });
});
