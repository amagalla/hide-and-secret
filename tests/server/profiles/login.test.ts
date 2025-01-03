import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const chai = use(chaiHttp);

const ROUTE = '/api/profiles/login';

describe(`POST ${ROUTE}`, () => {
    let
        queryStub: sinon.SinonStub,
        bcryptCompareStub: sinon.SinonStub,
        jwtSigbStub: sinon.SinonStub;

    const mockToken = '$2b$10$somehashedpasswordvalue';

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
        jwtSigbStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        queryStub.restore();
        bcryptCompareStub.restore();
        jwtSigbStub.restore();
    });

    context('should not pass', () => {
        it('should not pass with no email registered', async () => {
            const user = { email: 'email@email.test', username: 'amagalla', password: '' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: 'Password required'
            }

            const resp = await chai.request(app).post(ROUTE).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });

        it ('should not pass with no email registered', async () => {
            const user = { email: 'email@email.test', username: 'amagalla', password: 'abcd1234' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: `No profile found for ${user.email}. Please Register`
            }

            const mockQueryResult: [[]] = [[]];

            queryStub.resolves(mockQueryResult);

            const resp = await chai.request(app).post(ROUTE).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });

        it ('should not pass with wrong password', async () => {
            const user = { email: 'email@email.test', username: 'amagalla', password: 'wrongPassword' };

            const mockResponse = {
                success: false,
                statusCode: 400,
                message: `Password does not match with email`
            };

            const mockQueryResult = [
                [{
                    id: 1,
                    email: 'email@email.test',
                    username: 'amagalla',
                    password: 'hashedPassword'
                }]
            ];

            queryStub.resolves(mockQueryResult);
            bcryptCompareStub.resolves(false);

            const resp = await chai.request(app).post(ROUTE).send(user);

            expect(resp.status).to.equal(400);
            expect(resp.body).to.include(mockResponse);
        });
    });

    context('should login user successfully', () => {
        it('should pass', async () => {
            const user = { email: 'email@email.test', username: 'amagalla', password: 'abcd1234' };

            const mockResponse = {
                success: true,
                statusCode: 200,
                message: `User logged in successfully`,
                token: mockToken
            };

            const mockQueryResult = [
                [{
                    id: 1,
                    email: 'email@email.test',
                    username: 'amagalla',
                    password: 'hashedPassword'
                }]
            ];

            queryStub.resolves(mockQueryResult);
            bcryptCompareStub.resolves(true);
            jwtSigbStub.returns(mockToken);

            const resp = await chai.request(app).post(ROUTE).send(user);

            expect(resp.status).to.equal(200);
            expect(resp.body).to.include(mockResponse);
            
        });
    });
});