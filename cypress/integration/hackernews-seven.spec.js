
describe('Hacker Stories', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'
  context('Hitting the real API', () => {
    beforeEach(() => {
      cy.interceptInitialTerm()
        .as('getStories')

      cy.visit('/')
      cy.wait('@getStories')
    })

    it('shows 100 stories, then the next 100 after clicking "More"', () => {
      cy.interceptInitialTermPage1()
        .as('getNextStories')

      cy.get('.table-row').should('have.length', 100)

      cy.contains('More')
        .should('be.visible')
        .click()
      cy.wait('@getNextStories')
      cy.get('.table-row')
        .should('have.length', 200)
    })

    it('shows a "Loading ..." state before showing the results', () => {
      cy.visit('/')

      cy.assertLoadingIsShownAndHidden()

      cy.get('.table-row').should('have.length', 100)
    })

    it('searches via the last searched term', () => {
      cy.interceptNewTerm()
        .as('getSearchStories')

      cy.get('input')
        .should('be.visible')
        .should('have.value', initialTerm)
        .clear()
        .type(`${newTerm}{enter}`)

      cy.wait('@getSearchStories')

      cy.get('input')
        .should('be.visible')
        .should('have.value', newTerm)
        .clear()
        .type(`${initialTerm}{enter}`)

      cy.get('input')
        .should('be.visible')
        .should('have.value', initialTerm)

      cy.get('.table-row').should('have.length', 100)
      cy.get('.table-row')
        .first()
        .should('be.visible')
        .contains(initialTerm, { matchCase: false })
        .should('be.visible')
    })
  })

  context('Mocking the API', () => {
    beforeEach(() => {
      cy.interceptInitialTermFixtureStories()
        .as('getStories')

      cy.visit('/')
      cy.wait('@getStories')
    })

    context('List of stories', () => {
      const stories = require('../fixtures/stories')
      it('shows the right data for all rendered stories', () => {
        cy.get('.table-row')
          .first()
          .should('be.visible')
          .should('contain', stories.hits[0].title)
          .and('contain', 'Build Your Own React')
          .and('contain', stories.hits[0].author)
          .and('contain', 'peterhunt')
          .and('contain', stories.hits[0].num_comments)
          .and('contain', '287')
          .and('contain', stories.hits[0].points)
          .and('contain', '1039')
        cy.get(`.table-row a:contains(${stories.hits[0].title})`)
          .should('have.attr', 'href', stories.hits[0].url)

        cy.get('.table-row')
          .next()
          .should('be.visible')
          .should('contain', stories.hits[1].title)
          .and('contain', 'Relicensing React, Jest, Flow, and Immutable.js')
          .and('contain', stories.hits[1].author)
          .and('contain', 'dwwoelfel')
          .and('contain', stories.hits[1].num_comments)
          .and('contain', '498')
          .and('contain', stories.hits[1].points)
          .and('contain', '2280')
        cy.get(`.table-row a:contains(${stories.hits[1].title})`)
          .should('have.attr', 'href', stories.hits[1].url)

        cy.get('.table-row')
          .next()
          .should('be.visible')
          .should('contain', stories.hits[2].title)
          .and('contain', 'Vue.js vs. React')
          .and('contain', stories.hits[2].author)
          .and('contain', 'fanf2')
          .and('contain', stories.hits[2].num_comments)
          .and('contain', '471')
          .and('contain', stories.hits[2].points)
          .and('contain', '732')
        cy.get(`.table-row a:contains(${stories.hits[2].title})`)
          .should('have.attr', 'href', stories.hits[2].url)
      })
      it('shows one less story after demissing the first two', () => {
        // cy.get(':nth-child(2) > :nth-child(5) > .button-inline')
        cy.get('.button-inline:contains(Dismiss)')
          .first()
          .should('be.visible')
          .click()
        cy.get('.table-row').should('have.length', 2)
      })

      context('Order by', () => {
        it('orders by title', () => {
          // cy.get('[style="width: 40%;"] > .button-inline')
          cy.get('.button-inline:contains(Title)').as('titleHeader')
            .should('be.visible')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].title)
          cy.get(`.table-row a:contains(${stories.hits[0].title})`)
            .should('have.attr', 'href', stories.hits[0].url)

          cy.get('@titleHeader')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[2].title)
          cy.get(`.table-row a:contains(${stories.hits[2].title})`)
            .should('have.attr', 'href', stories.hits[2].url)
        })

        it('orders by author', () => {
          // cy.get('[style="width: 30%;"] > .list-header-button')
          cy.get('.button-inline:contains(Author)')
            .as('authorHeader')
            .should('be.visible')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[1].author)

          cy.get('@authorHeader')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].author)
        })

        it('orders by comments', () => {
          // cy.get('[style="width: 30%;"] > .list-header-button')
          cy.get('.button-inline:contains(Comments)')
            .as('CommentsHeader')
            .should('be.visible')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[1].num_comments)

          cy.get('@CommentsHeader')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].num_comments)
        })

        it('orders by points', () => {
          // cy.get('[style="width: 30%;"] > .list-header-button')

          cy.get('.button-inline:contains(Points)').as('PointsHeader')
            .should('be.visible')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[2].points)

          cy.get('@PointsHeader')
            .click()

          cy.get('.table-row')
            .first()
            .should('be.visible')
            .and('contain', stories.hits[0].points)
        })
      })
    })
  })

  context('Search', () => {
    beforeEach(() => {
      cy.interceptInitialTermFixtureEmpty()
        .as('getEmptyStories')

      cy.interceptNewTermFixtureStories()
        .as('getStories')

      cy.visit('/')
      cy.wait('@getEmptyStories')
      cy.get('input')
        .should('be.visible')
        .clear()
    })
    it('shows no story when none is returned', () => {
      cy.get('.table-row').should('not.exist')
    })

    it('types and hits ENTER', () => {
      cy.get('input').should('be.visible')
        .type(`${newTerm}{enter}`)

      cy.wait('@getStories')

      cy.get('.table-row').should('have.length', 3)
      cy.get('.table-row')
        .first()
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.get('input')
        .type(newTerm)
      cy.contains('Search')
        .should('be.visible')
        .click()

      cy.wait('@getStories')

      cy.get('.table-row').should('have.length', 3)
      cy.get('.table-row')
        .first()
        .contains(newTerm, { matchCase: false })
        .should('be.visible')
    })

    context('Last searches', () => {
      // Cypress._.times(3, () => {
      it('insert 6 entries at random', () => {
        const faker = require('faker')
        // const termsToSearchFor = faker

        cy.intercept(
          'GET',
          '**/search**', { fixture: 'stories' }
        ).as('getRandomStories')

        Cypress._.times(6, () => {
          const randomWord = faker.random.word()
          cy.get('input')
            .should('be.visible')
            .clear()
            .type(`${randomWord}{enter}`)

          cy.wait('@getRandomStories')

          cy.get('input')
            .should('be.visible')
        })

        cy.get('.table-header')
          .within(() => {
            cy.get('button')
              .should('have.length', 4)
          })
      })
    })
  })
  context('Loading Visible', () => {
    it('shows a "Loading ..." state before showing the results', () => {
      cy.intercept(
        'GET',
        '**/search**',
        { delay: 1000, fixture: 'stories' }
      ).as('getDelayedMockStories')

      cy.visit('/')

      cy.assertLoadingIsShownAndHidden()
      cy.wait('@getDelayedMockStories')

      cy.get('.table-row').should('have.length', 3)
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
    cy.get('p:contains(Something went wrong.)')
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
    cy.get('p:contains(Something went wrong.)')
      .should('be.visible')
  })
})
