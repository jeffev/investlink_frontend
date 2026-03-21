const FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxIiwicHJvZmlsZSI6IlVTRVIiLCJleHAiOjk5OTk5OTk5OTl9' +
  '.fake';

describe('Autenticação', () => {
  it('redireciona para /login quando não autenticado', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('login com credenciais válidas redireciona para fora do login', () => {
    cy.intercept('POST', '**/v1/user/login', {
      statusCode: 200,
      body: {
        access_token: FAKE_TOKEN,
        refresh_token: 'fake_refresh_token',
        profile: 'USER',
        name: 'Test User',
        user_name: 'testuser',
      },
    }).as('login');

    cy.intercept('GET', '**/v1/user_layout/**', { statusCode: 404, body: {} });

    cy.visit('/login');
    cy.get('input[name="login"]').type('testuser');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.url().should('not.include', '/login');
  });

  it('login com credenciais inválidas exibe mensagem de erro', () => {
    cy.intercept('POST', '**/v1/user/login', {
      statusCode: 401,
      body: { message: 'Usuário ou senha inválidos' },
    }).as('loginFail');

    cy.visit('/login');
    cy.get('input[name="login"]').type('errado');
    cy.get('input[name="password"]').type('errado');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.get('[role="alert"]').should('be.visible');
  });

  it('campos obrigatórios são validados antes de submeter', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Campo obrigatório').should('be.visible');
  });

  it('logout redireciona para /login', () => {
    cy.setupMocks();
    cy.visitAuthenticated('/');
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
  });

  it('após logout, rota protegida redireciona para /login', () => {
    cy.setupMocks();
    cy.visitAuthenticated('/');
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
    cy.visit('/listaAcoes');
    cy.url().should('include', '/login');
  });
});
