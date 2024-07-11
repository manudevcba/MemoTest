describe('Memotest Game', () => {
    beforeEach(() => {
        // Visita la página del juego antes de cada prueba
        cy.visit('http://127.0.0.1:8080/src/');
    });

    it('Debe mostrar el título del juego', () => {
        cy.get('h1 img').should('be.visible');
    });

    it('Debe mostrar el contador de movimientos', () => {
        cy.get('#moveCounter').should('have.text', '0');
    });

    it('Debe mostrar el botón de reiniciar', () => {
        cy.get('#resetButton').should('be.visible');
    });

    it('Debe voltear una carta cuando se hace clic', () => {
        cy.get('.card').first().click().should('have.class', 'flipped');
    });

    it('Debe aumentar el contador de movimientos al voltear dos cartas', () => {
        cy.get('.card').first().click();
        cy.get('.card').eq(1).click();
        cy.get('#moveCounter').should('have.text', '1');
    });

    it('Debe reiniciar el juego cuando se hace clic en el botón de reiniciar', () => {
        cy.get('.card').first().click();
        cy.get('.card').eq(1).click();
        cy.get('#resetButton').click();
        cy.get('#moveCounter').should('have.text', '0');
        cy.get('.card').each(($el) => {
            cy.wrap($el).should('not.have.class', 'flipped');
        });
    });

    it('Debe encontrar un par coincidente', () => {
        cy.get('.card').then((cards) => {
            const cardValues = [];

            cards.each((index, card) => {
                const cardValue = Cypress.$(card).data('card');
                cardValues.push({ value: cardValue, index });
            });

            // Buscar el primer par de cartas iguales
            const pair = cardValues.find((val, idx, arr) => arr.filter(v => v.value === val.value).length === 2);
            if (pair) {
                const firstCardIndex = pair.index;
                const secondCardIndex = cardValues.find(v => v.value === pair.value && v.index !== firstCardIndex).index;

                cy.get('.card').eq(firstCardIndex).click();
                cy.get('.card').eq(secondCardIndex).click();

                cy.wait(1500); // Esperar un poco para que las cartas sean marcadas como "matched"

                cy.get('.card').eq(firstCardIndex).should('have.class', 'matched');
                cy.get('.card').eq(secondCardIndex).should('have.class', 'matched');
            }
        });
    });
});
