/// <reference types="cypress" />


describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    // cy.get('#login').type('developer');
    // cy.get('#password').type('skillbox');
    cy.get('button').click();
  })

  it('Открытие случайной карточки', () => {
    // cy.get('.item').then((elem) => {
    //   const accounts = [...elem];
    //   const num = Math.round(Math.random() * accounts.length);
    //   console.log(accounts[num])
    //   cy.wrap(accounts[num]).click();
    // });
  })
})
