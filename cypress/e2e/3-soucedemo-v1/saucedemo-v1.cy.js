/// <reference types="cypress" />

describe('saucedemo v1', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.viewport(1920, 1080)
        cy.visit('https://www.saucedemo.com/v1/')

    })

    it('User login with fixtures Userdata', () => {
        cy.fixture('UserData').then((users) => {
            users.forEach((user) => {
                if (user.username == "") {
                    cy.get("#user-name").clear()
                    cy.get('[data-test=password]').type(user.password)
                } else if (user.password == "") {
                    cy.get("#user-name").clear().type(user.username)
                    cy.get('[data-test=password]').clear()
                } else {
                    cy.get("#user-name").clear().type(user.username)
                    cy.get('[data-test=password]').type(user.password)
                }
                cy.get('#login-button').click()


                //Validasi
                if (user.expected === "success") {
                    cy.url().should('include', 'inventory.html')
                    cy.get('.bm-burger-button').click()
                    cy.get("#logout_sidebar_link").click()
                    cy.url().should('include', 'index.html')
                } else {
                    if (user.username == "") {
                        cy.get('[data-test="error"]').should('be.visible')
                            .and('contain', 'Username is required')
                    } else if (user.password == "") {
                        cy.get('[data-test="error"]').should('be.visible')
                            .and('contain', 'Password is required')
                    } else {
                        cy.get('[data-test="error"]').should('be.visible')
                            .and('contain', 'Sorry, this user has been locked out.')
                    }
                }
            })
        })
    })

    it('Show username from fixture in log', () => {
        cy.fixture('userSaucedemo').then((data) => {
            data.forEach((key) => {
                if (key.perfomance === "normal") {
                    cy.log(key.username)
                }
            })
        })
    })

    it('Filter options product', () => {
        cy.get("#user-name").type("standard_user")
        cy.get('[data-test=password]').type("secret_sauce")
        cy.get('#login-button').click()
        cy.url().should('include', 'inventory.html')

        // Name(A to Z) > az
        cy.get('.product_sort_container')
            .should('have.value', 'az')
        //Validasi
        cy.get('.inventory_item_name')
            .should('contain', 'Sauce Labs Backpack')
        cy.contains('a', 'Sauce Labs Backpack').click()
        cy.get('.inventory_details_back_button').click({ force: true })

        // Name(Z to A) > za
        cy.get('.product_sort_container').select('za')
        //Validasi
        cy.get('.inventory_item_name')
            .should('contain', 'Test.allTheThings() T-Shirt (Red)')
        cy.contains('a', 'Test.allTheThings() T-Shirt (Red)').click()
        cy.get('.inventory_details_back_button').click({ force: true })

        // Price(low to high) > lohi
        cy.get('.product_sort_container').select('za')
        //Validasi
        cy.get('.inventory_item_name')
            .should('contain', 'Sauce Labs Onesie')
        cy.contains('a', 'Sauce Labs Onesie').click()
        cy.get('.inventory_details_back_button').click({ force: true })

        // Price(high to low) > hilo
        cy.get('.product_sort_container').select('za')
        //Validasi
        cy.get('.inventory_item_name')
            .should('contain', 'Sauce Labs Fleece Jacket')
        cy.contains('a', 'Sauce Labs Fleece Jacket').click()
        cy.get('.inventory_details_back_button').click({ force: true })
    })

    it('View cart and remove cart and continue shopping', () => {
        cy.get("#user-name").type("standard_user")
        cy.get('[data-test=password]').type("secret_sauce")
        cy.get('#login-button').click()
        cy.url().should('include', 'inventory.html')

        // add product
        cy.get('.inventory_item_name')
            .should('contain', 'Sauce Labs Backpack')

        cy.get('.btn_primary.btn_inventory').eq(0).click()
        cy.get('.btn_primary.btn_inventory').eq(1).click()

        cy.get('.shopping_cart_link.fa-layers.fa-fw')
            .scrollIntoView()
            .click()
        cy.url().should('include', 'cart.html')

        //remove cart
        cy.get('.btn_secondary.cart_button').eq(0).click()
        cy.get('.btn_secondary.cart_button').eq(0).click()

        //add continue shopping
        cy.get('.btn_secondary').click()
        cy.url().should('include', 'inventory.html')

        cy.get('.btn_primary.btn_inventory').eq(1).click()
        cy.get('.btn_primary.btn_inventory').eq(2).click()

        cy.get('.shopping_cart_link.fa-layers.fa-fw')
            .scrollIntoView()
            .click()
        cy.url().should('include', 'cart.html')
    })

    it('Checkout Product', () => {
        cy.get("#user-name").type("standard_user")
        cy.get('[data-test=password]').type("secret_sauce")
        cy.get('#login-button').click()
        cy.url().should('include', 'inventory.html')

        // add product
        cy.get('.inventory_item_name')
            .should('contain', 'Sauce Labs Backpack')

        cy.get('.btn_primary.btn_inventory').eq(0).click()
        cy.get('.btn_primary.btn_inventory').eq(1).click()

        // button cart
        cy.get('.shopping_cart_link.fa-layers.fa-fw')
            .scrollIntoView()
            .click()
        cy.url().should('include', 'cart.html')

        //Proses Checkout
        cy.get('.btn_action.checkout_button').click()
        cy.get('[data-test="firstName"]').type("fachri")
        cy.get('.btn_primary.cart_button').click()

        // validation lastName
        cy.get('[data-test="error"]').should('be.visible')
            .and('contain', 'Last Name is required')

        cy.get('[data-test="lastName"]').type("alvi")
        cy.get('.btn_primary.cart_button').click()

        // validation postalCode null
        cy.get('[data-test="error"]').should('be.visible')
            .and('contain', 'Postal Code is required')

        cy.get('[data-test="postalCode"]').type("12345")
        cy.get('.btn_primary.cart_button').click()

        cy.url().should('include', 'checkout-step-two.html')

        //proses cancel
        cy.get('.cart_cancel_link.btn_secondary').click()
        cy.url().should('include', 'inventory.html')

        // button cart
        cy.get('.shopping_cart_link.fa-layers.fa-fw')
            .scrollIntoView()
            .click()
        cy.url().should('include', 'cart.html')

        //Proses Checkout All
        cy.get('.btn_action.checkout_button').click()
        cy.get('[data-test="firstName"]').type("fachri")
        cy.get('.btn_primary.cart_button').click()
        cy.get('[data-test="firstName"]').type("fachri")
        cy.get('[data-test="lastName"]').type("alvi")
        cy.get('[data-test="postalCode"]').type("12345")
        cy.get('.btn_primary.cart_button').click()


        //Finish
        cy.get('.btn_action.cart_button').click()
        cy.url().should('include', 'checkout-complete.html')
        cy.get('.complete-header').should('be.visible').and('contain', 'THANK YOU FOR YOUR ORDER')
    })

    describe('Login Test Suite', () => {
        context('Positive Scenario', () => {
            it('Login sukses dengan user valid', () => {
                // ...
            })
        })

        context('Negative Scenario', () => {
            it('Login gagal dengan password salah', () => {
                // ...
            })
        })


    })

})