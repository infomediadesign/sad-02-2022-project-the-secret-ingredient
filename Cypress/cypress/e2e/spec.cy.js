describe('spec.cy.js', () => {
  
  beforeEach(() => {

    cy.visit('http://localhost:3000/board');
  
  })
  
  it('Add Button label check', () => {

    cy.get('.btn-primary').contains('Add Issue List');
  })

  it('Delete Button Label Check', () => {

    cy.get('.btn-secondary').contains('Delete List');
  })

  it('Add Button click test', () => {

    cy.get('.btn-primary').contains('Add Issue List').eq(0).click();
  })

  it('Delete Button click test', () => {

    cy.get('.btn-secondary').contains('Delete List').eq(0).click();
  })

  it('Modal test', () => {

    cy.get('.issueList').eq(0).click({force:true});
  })

  it('Login Page visit Check', () => {

    cy.visit('http://localhost:3000');
  })



})
