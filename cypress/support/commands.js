import 'cypress-localStorage-commands'
// import 'experimentalSessionSupport'

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
})

Cypress.Commands.add('interceptInitialTerm', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'

  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    query: {
      query: initialTerm,
      page: '0',
      hitsPerPage: '100'
    }
  })
})

Cypress.Commands.add('interceptNewTerm', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'

  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    query: {
      query: newTerm,
      page: '0',
      hitsPerPage: '100'
    }
  })
})

Cypress.Commands.add('interceptInitialTermPage1', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'

  cy.intercept({
    method: 'GET',
    pathname: '**/search',
    delay: 1000,
    query: {
      query: initialTerm,
      page: '1',
      hitsPerPage: '100'
    }
  })
})

Cypress.Commands.add('interceptNewTermFixtureStories', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'
  
  cy.intercept('GET',
            `**/search?query=${newTerm}&page=0&hitsPerPage=100`,
            { fixture: 'stories' }
  )
})

Cypress.Commands.add('interceptInitialTermFixtureEmpty', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'
  cy.intercept('GET',
              `**/search?query=${initialTerm}&page=0&hitsPerPage=100`,
              { fixture: 'empty' }
  )
})

Cypress.Commands.add('interceptInitialTermFixtureStories', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'
  cy.intercept('GET',
            `**/search?query=${initialTerm}&page=0&hitsPerPage=100`,
            { fixture: 'stories' }
  )
})

