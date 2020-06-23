describe('todos page', () => {
    beforeEach(() => {
        cy.visit('/todos');
        cy.get('[data-test="create-todo-input"]').as('createTodoInput');
    });
    it('create todo', () => {
        cy.get('@createTodoInput').type('Hello, world!');
        cy.get('button').click();
        cy.get('@createTodoInput').should('be.empty');
    });
});
