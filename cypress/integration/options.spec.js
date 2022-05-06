describe('Options', () =>{
  before(function (){
    cy.visit('/')

    cy.request({
      method: 'POST',
      url: `${Cypress.env('api_server')}/user/login`,
      body: {
        email: `${Cypress.env('login')}`,
        password: `${Cypress.env('password')}`
      }
    }).then((response) => {
      window.localStorage.setItem('userId', response.body.payload.userId)
      window.localStorage.setItem('token', response.body.payload.token)

      cy.request({
        method: 'PATCH',
        url: `${Cypress.env('api_server')}/user/profile`,
        headers: {
          Authorization: response.body.payload.token
        },
        body: {
          firstName: "Gondoras",
          lastName: "Tests",
          phone: "17038504063",
          about: "",
          goals: "",
          countryName: "United States",
          englishLevel: "Intermediate",
          tShirtSize: "Women - L"
        }
      })

      cy.visit(`/settings/${response.body.payload.userId}/profile`)
    })
  })

  it('Profile form fill', () => {
    cy.get('[data-qa="englishLevel"]')
      .click()
    cy.get('[class*="ant-select-item"][title="Zero"]')
      .click()

    cy.intercept('PATCH', '/user/profile')
      .as('profileChange')

    cy.get('.ant-btn-primary')
      .click()

    cy.wait('@profileChange')
      .then((interception) => {
        expect(interception.response.body.message, "User profile didn't update" ).to.eq('User profile updated')
      })
  })
})
