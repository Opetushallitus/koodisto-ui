import { API_BASE_PATH, BASE_PATH } from '../../../src/context/constants';

const koodistoUri = 'arvosanat';
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});
beforeEach(() => {
    cy.task('deleteFolder', Cypress.config('downloadsFolder'));
});
describe('Errors', () => {
    it('shows error boudary if codes fails', () => {
        cy.intercept('GET', `${API_BASE_PATH}/codes`, (req) => {
            req.reply({
                statusCode: 500,
                delay: 10,
            });
        });
        cy.visit(`${BASE_PATH}`);
        cy.contains('Service Unavailable').should('be.visible');
    });
    it('can download arvosanat', () => {
        cy.intercept(`${API_BASE_PATH}/codes`, { fixture: 'codes.json' });
        cy.visit(`${BASE_PATH}`);
        cy.intercept(`${API_BASE_PATH}/json/arvosanat/koodi`, (req) => {
            req.reply({
                statusCode: 500,
                delay: 10,
            });
        });
        cy.get(`svg[name="${koodistoUri}-uploadicon"]`).click();
        cy.contains('Server Error').should('be.visible');
    });
});
