/// <reference types="cypress" />


describe('Тест web-приложения "Coin"', () => {
  beforeEach('Авторизация в приложении', () => {
    cy.visit('http://localhost:8080');
    cy.get('#login').clear();
    cy.get('#password').clear();
    cy.get('#login').type('developer');
    cy.get('#password').as('password').type('qwerty');
    cy.get('@password').blur();
    cy.get('button').click();
    cy.wait(1000);
    cy.reload();
    cy.wait(1000);
    cy.get('.accounts__list').should('not.be.empty');
  })

  it('Открытие случайной карточки', () => {
    cy.get('.open-card').then((elem) => {
      const accounts = [...elem];
      const num = Math.round(Math.random() * accounts.length);
      console.log(accounts[num])
      cy.wrap(accounts[num]).click();
      cy.reload();
    });

  });
  it('Перевод с первого счета на другой', () => {
    cy.get('.open-card').then((elem) => {
      const accounts = [...elem];
      const num = 0;
      console.log(accounts[num])
      cy.wrap(accounts[num]).click();
      cy.reload();
      cy.get('#to').type('14205030348554160711530438');
      cy.get('#amount').type('100');
      cy.get('#send').click();
      cy.get('.transfer__success').contains('Перевод выполнен успещно!');
    });
  });

  it('Создание нового счета и попытка перевода с него', () => {
    cy.get(' #createAccount').as('create').click();
    cy.wait(1000);
    cy.get('@create').should('have.class', 'btn-success');
    cy.get('.open-card').then((elem) => {
      const accounts = [...elem];
      const num = accounts.length - 1;
      console.log(accounts[num])
      cy.wrap(accounts[num]).click();
      cy.reload();
      cy.get('#to').type('14205030348554160711530438');
      cy.get('#amount').type('100');
      cy.get('#send').click();
      cy.get('.transfer__error').contains('Недостатнчно средств на счете');
    });
  });
})
