import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/game/secrets/:stashId/stash';

const decodedToken = {
    id: '1',
    email: 'email@email.test',
    username: 'Yuri'
}

describe(`POST ${ROUTE}`, () => {
    let
        queryStub: sinon.SinonStub,
        jwtVerifyStub: sinon.SinonStub;

    const
        id = 1,
        mockToken = '$2b$10$somehashedpasswordvalue';

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        jwtVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        queryStub.restore();
        jwtVerifyStub.restore();
    });

    context('should not delete and stash a secret message', () => {
        it ('should not pass missing auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 401,
                message: 'Access denied. No token provided.'
            };

            const resp = await chai.request(app).post(ROUTE.replace(':stashId', '1')).set('Authorization', '').send();

            expect(resp.status).to.equal(401);
            expect(resp.body).to.include(mockResponse);
        });

        it ('should not pass with non-valid auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Invalid token.'
            };

            jwtVerifyStub.throws(new Error('Invalid token'));

            const resp = await chai.request(app).post(ROUTE.replace(':stashId', '1')).set('Authorization', `Bearer ${mockToken}`).send();

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });

        it('should not pass with no stashId in database', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Secret message not found or already deleted'
            };

            jwtVerifyStub.returns(decodedToken);

            queryStub.resolves([[]]);

            const resp = await chai.request(app).post(ROUTE.replace(':stashId', '999')).set('Authorization', `Bearer ${mockToken}`).send();

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
    });

    context('should delete and stash a secret message', () => {
        it('should successfully delete and stash the secret message', async () => {
            const mockResponse = {
                success: true,
                statusCode: 200,
                message: 'Successfully deleted and stashed the secret message'
            };

            jwtVerifyStub.returns(decodedToken);

            const selectMessageQuery = [{
                message: 'This is a secret message',
                id: '1'
            }];

            queryStub.onFirstCall().resolves([selectMessageQuery]);
            queryStub.onSecondCall().resolves([{ affectedRows: 1 }]);
            queryStub.onThirdCall().resolves([{ affectedRows: 1 }]);

            const resp = await chai.request(app).post(ROUTE.replace(':stashId', '1')).set('Authorization', `Bearer ${mockToken}`).send();

            expect(resp.status).to.equal(200);
            expect(resp.body).to.include(mockResponse);
        });
    });
});