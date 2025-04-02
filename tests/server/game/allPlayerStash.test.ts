import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/game/stash';

const decodedToken = {
    profile_id: '1',
    email: 'email@email.test',
    username: 'Yuri'
}

describe(`GET ${ROUTE}`, () => {
    let
        queryStub: sinon.SinonStub,
        jwtVerifyStub: sinon.SinonStub;

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        jwtVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        queryStub.restore();
        jwtVerifyStub.restore();
    });

    context('should not get all stashed secret messages', () => {
        it('should not pass missing auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 401,
                message: 'Access denied. No token provided.'
            };

            const resp = await chai.request(app).get(ROUTE).set('Authorization', '').send();

            expect(resp.status).to.equal(401);
            expect(resp.body).to.include(mockResponse);
        });

        it('should not pass with non-valid auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Invalid token.'
            };

            jwtVerifyStub.throws(new Error('Invalid token'));

            const resp = await chai.request(app).get(ROUTE).set('Authorization', `Bearer $2b$10$somehashedpasswordvalue`).send();

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });

        it('should not pass with an error', async () => {
            const mockResponse = {
                success: false,
                statusCode: 500,
                message: 'Unexpected error occurred when retrieving stashed secret messages'
            };

            jwtVerifyStub.returns(decodedToken);
            queryStub.throws(new Error('Unexpected error occurred when retrieving stashed secret messages'));

            const resp = await chai.request(app).get(ROUTE).set('Authorization', `Bearer $2b$10$somehashedpasswordvalue`).send();

            expect(resp.status).to.equal(500);
            expect(resp.body).to.include(mockResponse);
        });
    });

    context('should get all stashed secret messages', () => {
        it('should pass with valid user', async () => {
            const mockResponse = {
                success: true,
                statusCode: 200,
                message: 'Retrieved all stashed secret messages successfully',
                stashedSecrets: [
                    {
                        "stash_id": 1,
                        "message": "Monika is here!!!",
                        "player_id": 2,
                        "player_username": "Monika"
                    },
                    {
                        "stash_id": 3,
                        "message": "Monika is here again and again!!!",
                        "player_id": 2,
                        "player_username": "Monika"
                    }
                ]
            };

            jwtVerifyStub.returns(decodedToken);
            queryStub.resolves([
                [
                    {
                        stash_id: 1,
                        message: 'Monika is here!!!',
                        player_id: 2,
                        player_username: 'Monika'
                    },
                    {
                        stash_id: 3,
                        message: 'Monika is here again and again!!!',
                        player_id: 2,
                        player_username: 'Monika'
                    }
                ]
            ]);

            const resp = await chai.request(app).get(ROUTE).set('Authorization', `Bearer $2b$10$somehashedpasswordvalue`).send();

            expect(resp.status).to.equal(200);
            expect(resp.body).to.deep.equal(mockResponse);
        });
    });
});