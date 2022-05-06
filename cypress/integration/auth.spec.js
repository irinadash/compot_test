describe('Auth', () => {
    beforeEach(function (){
        cy.visit('/user/login');
    })
    it('Login with valid credentials', () => {
        cy.intercept('POST', '/user/login')
            .as('login')

        cy.get('#normal_login_email')
            .type(Cypress.env('login'))
        cy.get('#normal_login_password')
            .type(Cypress.env('password'))
        cy.get('.login-form-button')
            .click()

        cy.wait('@login')
            .then(({response}) => {
                cy.url()
                    .should('include', response.body.payload.userId)
            })
        cy.get('.ant-avatar-square')
            .should('be.visible')
    })

    it('Email input field is required', () => {
        cy.get('#normal_login_email')
            .type(Cypress.env('login'))
            .clear()

        cy.fixture('errors').then((errors) => {
            cy.xpath('//div[contains(@class, "ant-col")][div//input[@id="normal_login_email"]]//div[@role="alert"]')
              .should('have.text', errors.required)
        })
    })

    it('Password input field is required', () => {
        cy.get('#normal_login_password')
            .type('123456')
            .clear()

        cy.fixture('errors').then((errors) => {
        cy.xpath('//div[contains(@class, "ant-col")][div//input[@id="normal_login_password"]]//div[@role="alert"]')
          .should('have.text', errors.required)
        })
    })

    it('Email validation', () => {
        cy.get('#normal_login_email')
            .type(Cypress.env('login'))
        cy.fixture('errors').then((errors) => {
        cy.xpath('//div[contains(@class, "ant-col")][div//input[@id="normal_login_email"]]//div[@role="alert"]')
          .should('have.text', errors.email)
        })
    })
})
