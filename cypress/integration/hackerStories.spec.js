// const { orderBy } = require('cypress/types/lodash')

describe('Hacker Stories', () => {
  const initialTerm = 'React'
  const newTerm = 'Cypress'
  context('Hitting the real API', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialTerm,
          page: '0'
        }
      }).as('getStories')

      cy.visit('/')
      cy.wait('@getStories')
    })

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialTerm,
          page: '1'
        }
      }).as('getNextStories')

      cy.get('.item').should('have.length', 20)

      cy.contains('More').click()
      cy.wait('@getNextStories')
      cy.get('.item').should('have.length', 40)
    })

    it('searches via the last searched term', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: `${newTerm}`,
          page: '0'
        }
      }).as('getSearchStories')
      cy.get('#search')
        .clear()
        .type(`${newTerm}{enter}`)
      cy.wait('@getSearchStories')
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
        .click()
      cy.wait('@getStories')
      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', initialTerm)
      cy.get(`button:contains(${newTerm})`)
        .should('be.visible')
    })
  })

  context('Mocking the API', () => {
    context('footer and list of stories', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
       `**/search?query=${initialTerm}&page=0`,
       { fixture: 'stories' }
        ).as('getStories')

        cy.visit('/')
        cy.wait('@getStories')
      })
      it('shows the footer', () => {
        cy.get('footer')
          .should('be.visible')
          .and('contain', 'Icons made by Freepik from www.flaticon.com')
      })

      context('List of stories', () => {
        const stories = require('../fixtures/stories')
        it('shows the right data for all rendered stories', () => {
          cy.get('.item')
            .first()
            .should('contain', stories.hits[0].title)
            .and('contain', 'Build Your Own React')
            .and('contain', stories.hits[0].author)
            .and('contain', 'peterhunt')
            .and('contain', stories.hits[0].num_comments)
            .and('contain', '287')
            .and('contain', stories.hits[0].points)
            .and('contain', '1039')
          cy.get(`.item a:contains(${stories.hits[0].title})`)
            .should('have.attr', 'href', stories.hits[0].url)

          cy.get('.item')
            .next()
            .should('contain', stories.hits[1].title)
            .and('contain', 'Relicensing React, Jest, Flow, and Immutable.js')
            .and('contain', stories.hits[1].author)
            .and('contain', 'dwwoelfel')
            .and('contain', stories.hits[1].num_comments)
            .and('contain', '498')
            .and('contain', stories.hits[1].points)
            .and('contain', '2280')
          cy.get(`.item a:contains(${stories.hits[1].title})`)
            .should('have.attr', 'href', stories.hits[1].url)

          cy.get('.item')
            .next()
            .should('contain', stories.hits[2].title)
            .and('contain', 'Vue.js vs. React')
            .and('contain', stories.hits[2].author)
            .and('contain', 'fanf2')
            .and('contain', stories.hits[2].num_comments)
            .and('contain', '471')
            .and('contain', stories.hits[2].points)
            .and('contain', '732')
          cy.get(`.item a:contains(${stories.hits[2].title})`)
            .should('have.attr', 'href', stories.hits[2].url)
        }) 
        it('shows one less story after demissing the first two', () => {
          cy.get('.button-small')
            .first()
            .click()
          cy.get('.item').should('have.length', 2)
        })

        context('Order by', () => {
          it('orders by title', () => {
            // cy.get('[style="width: 40%;"] > .list-header-button')
            cy.get('.list-header-button:contains(Title)').as('titleheader')
              .click()

            cy.get('.item')
              .first()
              .should('be.visible')
              .and('contain', stories.hits[0].title)
            cy.get(`.item a:contains(${stories.hits[0].title})`)
              .should('have.attr', 'href', stories.hits[0].url)

            cy.get('@titleheader')
              .click()

            cy.get('.item')
              .first()
              .should('be.visible')
              .and('contain', stories.hits[2].title)
            cy.get(`.item a:contains(${stories.hits[2].title})`)
              .should('have.attr', 'href', stories.hits[2].url)
          })

          it('orders by author', () => {
            // cy.get('[style="width: 30%;"] > .list-header-button')
            cy.get('.list-header-button:contains(Author)').as('authorheader')
              .click()
            cy.get('.item')
              .first()
              .should('be.visible')
              .and('contain', stories.hits[1].author)
           

            cy.get('@authorheader')
             .click()

            cy.get('.item')
              .first()
              .should('be.visible')
              .and('contain', stories.hits[0].author)
            
          })

          it('orders by comments', () => {
               // cy.get('[style="width: 30%;"] > .list-header-button')
               cy.get('.list-header-button:contains(Comments)').as('Commentsheader')
               .click()
             cy.get('.item')
               .first()
               .should('be.visible')
               .and('contain', stories.hits[1].num_comments)
            
 
             cy.get('@Commentsheader')
              .click()
 
             cy.get('.item')
               .first()
               .should('be.visible')
               .and('contain', stories.hits[0].num_comments)
             

          })

          it('orders by points', () => {
                  // cy.get('[style="width: 30%;"] > .list-header-button')
                 
                  cy.get('.list-header-button:contains(Points)').as('Pointsheader')
                  .click()
                cy.get('.item')
                  .first()
                  .should('be.visible')
                  .and('contain', stories.hits[2].points)
             
              
                cy.get('@Pointsheader')
                 .click()
                 
                cy.get('.item')
                  .first()
                  .should('be.visible')
                  .and('contain', stories.hits[0].points)




          })
        })
      })
    })

    context('Search', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `**/search?query=${initialTerm}&page=0`,
          { fixture: 'empty' }
        ).as('getEmptyStories')

        cy.intercept(
          'GET',
          `**/search?query=${newTerm}&page=0`,
          { fixture: 'stories' }
        ).as('getStories')

        cy.visit('/')
        cy.wait('@getEmptyStories')
        cy.get('#search')
          .clear()
      })
         it.only('shows no story when none is returned',() => {
          cy.get('.item').should('not.exist')

         })

      it('types and hits ENTER', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.wait('@getStories')

        cy.get('.item').should('have.length', 3)
        // cy.get('.item')
        //  .first()
        //  .should('contain', newTerm)
        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
      })

      it('types and clicks the submit button', () => {
        cy.get('#search')
          .type(newTerm)
        cy.contains('Submit')
          .click()
        cy.wait('@getStories')

        cy.get('.item').should('have.length', 3)
        // cy.get('.item')
        // .first()
        // .should('contain', newTerm)
        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
      })

      context('Last searches', () => {
        // Cypress._.times(3, () => {
        it('shows a max of 5 buttons for the last searched terms', () => {
          const faker = require('faker')

          cy.intercept(
            'GET',
            '**/search**', { fixture: 'stories' }
          ).as('getRandomStories')

          Cypress._.times(6, () => {
            cy.get('#search')
              .clear()
              .type(`${faker.random.word()}{enter}`)
            cy.wait('@getRandomStories')
          })
          cy.get('.last-searches button')
            .should('have.length', 5)
        })
      })
    })
  })
})

context('Errors', () => {
  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept(
      'GET',
      '**/search**',
      { statusCode: 500 }
    ).as('getServerFailure')

    cy.visit('/')
    cy.wait('@getServerFailure')
    cy.get('p:contains(Something went wrong ...)')
      .should('be.visible')
  })

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept(
      'GET',
      '**/search**',
      { forceNetworkError: true }
    ).as('getNetworkFailure')

    cy.visit('/')
    cy.wait('@getNetworkFailure')
    cy.get('p:contains(Something went wrong ...)')
      .should('be.visible')
  })
})
