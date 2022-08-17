import { BASE_PATH, API_INTERNAL_PATH } from '../../src/context/constants';

describe('Koodi Edit page', () => {
    beforeEach(() => {
        cy.mockBaseIntercepts();
        cy.intercept(`${API_INTERNAL_PATH}/koodi/kunta_020/2`, { fixture: 'koodiPage.json' });
        cy.intercept(`${API_INTERNAL_PATH}/koodisto/kunta`, { fixture: 'koodiPageKoodisto.json' });
        cy.visit(`${BASE_PATH}/koodi/edit/kunta_020/2`);
    });
    it('Contains versioi button', () => {
        cy.get('button[name=KOODI_VERSIOI]').should('be.visible');
    });
    it('Versio button opens dialog', () => {
        cy.get('button[name=KOODI_VERSIOI]').should('be.visible').click();
        cy.get('#close-dialog').should('be.visible');
    });
    it('Versioi dialog can be closed', () => {
        cy.get('button[name=KOODI_VERSIOI]').should('be.visible').click();
        cy.get('#close-dialog').click().should('not.exist');
    });
    it('Versioi action disabled if not confirmed', () => {
        cy.get('button[name=KOODI_VERSIOI]').should('be.visible').click();
        cy.get('button[name=CONFIRMATION_ACTION]').should('be.visible').should('be.disabled');
    });
    it('Versioi action available after confirmation', () => {
        cy.get('button[name=KOODI_VERSIOI]').should('be.visible').click();
        cy.get('input[name=CONFIRMATION_CHECK]').should('be.visible').click({ force: true });
        cy.get('button[name=CONFIRMATION_ACTION]').should('be.visible').should('not.be.disabled');
    });
    it('Versioi redirects to koodisto page', () => {
        cy.intercept('POST', `${API_INTERNAL_PATH}/koodi/kunta_020/2`, { statusCode: 201, fixture: 'koodiPage.json' });
        cy.intercept(`${API_INTERNAL_PATH}/koodisto`, { fixture: 'codes.json' });
        cy.intercept(`${API_INTERNAL_PATH}/koodisto/kunta/2`, { fixture: 'kuntaKoodisto.json' });
        cy.intercept(`${API_INTERNAL_PATH}/koodi/koodisto/kunta/2`, { fixture: 'kuntaKoodistoKoodit.json' });
        cy.get('button[name=KOODI_VERSIOI]').should('be.visible').click();
        cy.get('input[name=CONFIRMATION_CHECK]').should('be.visible').click({ force: true });
        cy.get('button[name=CONFIRMATION_ACTION]').should('be.visible').click({ force: true });
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/koodisto-app/koodisto/view/kunta/2');
        });
    });
});
