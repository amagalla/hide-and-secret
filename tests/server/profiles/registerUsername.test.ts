import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

describe(`POST /api/profiles/:id/username`, () => {
    let
        queryStub: sinon.SinonStub,
        jwtSignStub: sinon.SinonStub;

    const
        id = 1,
        mockToken = '$2b$10$somehashedpasswordvalue';

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        jwtSignStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        queryStub.restore();
        jwtSignStub.restore();
    });

    context('should not register username', () => {
        it('should fail for no username input', async () => {
            const user = { username: '' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Username is required'
            }

            const resp = await chai.request(app).patch(`/api/profiles/${id}/username`).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
        
        it('should fail for short username', async () => {
            const user = { username: 'abc' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Username needs to be between 4 - 20 characters long'
            }

            const resp = await chai.request(app).patch(`/api/profiles/${id}/username`).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
        
        it('should fail for long username', async () => {
            const user = { username: 'abcdefabcdefabcdefabcdefa' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Username needs to be between 4 - 20 characters long'
            }

            const resp = await chai.request(app).patch(`/api/profiles/${id}/username`).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
        
        it('should fail for username already in use', async () => {
            const user = { username: 'amagalla' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: `Username ${user.username} already in use. Please choose another`
            }

            const mockQueryResult = [
                [{
                    id: 1,
                }], []
            ];

            queryStub.resolves(mockQueryResult);

            const resp = await chai.request(app).patch(`/api/profiles/${id}/username`).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
        
        it('should fail for unfound user', async () => {
            const user = { username: 'amagalla' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: `User ${user.username} not found`
            }

            const mockCheckUser = [
                [], []
            ];

            queryStub.onCall(0).resolves(mockCheckUser);
            queryStub.onCall(1).resolves([ { affectedRows: 0 } ]);

            const resp = await chai.request(app).patch(`/api/profiles/${id}/username`).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
    });

    context('shout register username', () =>{
        it('should register', async () => {
            const user = { username: 'amagalla' };

            const mockResponse = {
                success: true,
                statusCode: 200,
                message: 'Username updated successfully',
                token: mockToken,
                user: {
                    id,
                    email: 'email@email.test',
                    username: user.username
                },
            };

            const mockCheckUser = [
                [], []
            ];

            const mockGetProfile = [
                [{
                    id: 1,
                    email: 'email@email.test',
                    username: 'amagalla',
                }]
            ];

            queryStub.onCall(0).resolves(mockCheckUser);
            queryStub.onCall(1).resolves([ { affectedRows: 1 } ]);
            queryStub.onCall(2).resolves(mockGetProfile);
            jwtSignStub.returns(mockToken);

            const resp = await chai.request(app).patch(`/api/profiles/${id}/username`).send(user);

            expect(resp.status).to.equal(200);
            expect(resp.body).to.deep.include(mockResponse);
        });
    });
});