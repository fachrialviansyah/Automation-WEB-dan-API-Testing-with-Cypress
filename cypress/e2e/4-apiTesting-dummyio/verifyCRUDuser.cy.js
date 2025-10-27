describe('API Testing - DummyApi.Io', () => {
    const BaseURL = 'https://dummyapi.io/data/v1'
    const headers = { 'app-id': Cypress.env('appId') }

    let idUser
    let createdUserId

    it('GET All Users', () => {
        cy.request({
            method: 'GET',
            url: `${BaseURL}/user`,
            headers
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.be.an('array');
            expect(response.body.data[0]).to.have.property('firstName');

            cy.log(JSON.stringify(response.body)); // tampil di log test runner
            idUser = response.body.data[0].id
        })
    });

    it('Get User By ID', () => {
        cy.request({
            method: 'GET',
            url: `${BaseURL}/user/${idUser}`,
            headers
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.eq(idUser);
            cy.log(JSON.stringify(response.body));
            // expect(response.body.data).to.be.an('array');
        })
    });

    it('Post create user', () => {
        const requestBody = {
            firstName: 'Fachri',
            lastName: 'Alvi',
            email: `fachriq_${Date.now()}@example.com` // supaya unik tiap test
        };
        cy.request({
            method: 'POST',
            url: `${BaseURL}/user/create`,
            headers,
            body: requestBody
        }).then((response) => {
            // --- Assertions utama ---
            expect(response.status).to.eq(200); // status OK
            expect(response.body).to.have.property('id'); // pastikan ada ID
            expect(response.body).to.have.property('firstName', requestBody.firstName);
            expect(response.body).to.have.property('lastName', requestBody.lastName);
            expect(response.body).to.have.property('email', requestBody.email);

            // simpan ID user yang baru dibuat untuk test berikutnya
            createdUserId = response.body.id;

            cy.log(`User berhasil dibuat dengan ID: ${createdUserId}`);
            console.log('Response JSON:', response.body);
        })
    });

    it('Update user data', () => {
        cy.then(() => {
            const updatedBody = {
                firstName: 'Fachri Update',
                lastName: 'Alvi Update'
            };

            cy.request({
                method: 'PUT',
                url: `${BaseURL}/user/${createdUserId}`,
                headers,
                body: updatedBody,
                failOnStatusCode: false
            }).then((res) => {
                console.log('PUT Response:', res.body);
                expect(res.status).to.eq(200);
                expect(res.body.firstName).to.eq(updatedBody.firstName);
                expect(res.body.lastName).to.eq(updatedBody.lastName);
            });
        });
    });

    it('Delete user data', () => {
        cy.then(() => {

            cy.request({
                method: 'DELETE',
                url: `${BaseURL}/user/${createdUserId}`,
                headers
            }).then((res) => {
                console.log('DELETE Response:', res.body);
                expect([200, 204]).to.include(res.status);
            });
        });
    });

    it('Check user deleted', () => {
        cy.then(() => {
            cy.request({
                method: 'GET',
                url: `${BaseURL}/user/${createdUserId}`,
                headers,
                failOnStatusCode: false
            }).then((res) => {
                console.log('GET after DELETE:', res.body);
                expect(res.status).to.eq(404);
                expect(res.body.error).to.contain('RESOURCE_NOT_FOUND');
            });
        });
    });
});