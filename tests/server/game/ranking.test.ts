import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/game/ranking';

describe(`GET ${ROUTE}`, () => {
    let
        queryStub: sinon.SinonStub,
        jwtVerifyStub: sinon.SinonStub;

    const mockToken = '$2b$10$somehashedpasswordvalue';

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        jwtVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        queryStub.restore();
        jwtVerifyStub.restore();
    });

    context('should not get all ranking', () => {
        it('shoud not pass missing auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 401,
                message: 'Access denied. No token provided.'
            };

            const resp = await chai.request(app).get(ROUTE).set('Authorization', '').send();

            expect(resp.status).to.equal(401);
            expect(resp.body).to.include(mockResponse);
        });

        it('shoud not pass with non-valid auth token', async () => {
            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Invalid token.'
            };

            jwtVerifyStub.throws(new Error('Invalid token.'))

            const resp = await chai.request(app).get(ROUTE).set('Authorization', 'wrongtokenvalue').send();

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
    });

    context('should get all ranking', () => {
        it('should get all ranking successfully', async () => {
            const mockResponse = {
                success: true,
                statusCode: 200,
                message: 'Retrieved ranking successfully',
                ranking: [
                    {
                        profile_id: '5',
                        username: 'Yuri',
                        score: 100
                    },
                    {
                        profile_id: '3',
                        username: 'Monika',
                        score: 80
                    }
                ]
            };

            const mockQueryResult = [
                [
                    {
                        profile_id: '5',
                        username: 'Yuri',
                        score: 100
                    },
                    {
                        profile_id: '3',
                        username: 'Monika',
                        score: 80
                    }
                ]
            ];

            const decodedToken = {
                profile_id: '1',
                email: 'email@email.test',
                username: 'Yuri'
            }

            jwtVerifyStub.returns(decodedToken);

            queryStub.returns(mockQueryResult);

            const resp = await chai.request(app).get(ROUTE).set('Authorization', mockToken).send();

            expect(resp.status).to.equal(200);
            expect(resp.body).to.deep.equal(mockResponse);
        });
    });
});