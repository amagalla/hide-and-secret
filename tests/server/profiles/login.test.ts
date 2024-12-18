import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import * as registerUser from '../../../app/server/controller/registration';

const chai = use(chaiHttp);

describe('POST /api/profiles/register', () => {
  let registerUserStub: sinon.SinonStub;

  beforeEach(() => {
    registerUserStub = sinon.stub(registerUser, 'registerUser');
  });

  afterEach(() => {
    registerUserStub.restore();
  });

  context('User should not pass registration', () => {
    it ('should return 400 for too short of a username length', async () => {
      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Username needs to be between 4 - 20 characters long',
      }

      registerUserStub.resolves(mockResponse);
      
      const user = { email: 'email@email.test', username: 'ama', password: 'abcd1234' };

      const resp = await chai.request(app).post('/api/profiles/register').send(user);

      expect(resp).to.have.status(400);
      expect(resp.body).to.include(mockResponse);
    });

    it('should return 400 for invalid password length', async () => {
      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Password needs to be between 8 to 64 characters long',
      }

      registerUserStub.resolves(mockResponse);

      const user = { email: 'email@email.test', username: 'amagalla', password: 'abcd' };

      const res = await chai.request(app).post('/api/profiles/register').send(user);

      expect(res).to.have.status(400);
      expect(res.body).to.include(mockResponse);
    });

    it('should return 400 for no entries', async () => {
      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Email required',
      }

      registerUserStub.resolves(mockResponse);

      const user = { email: '', username: '', password: '' };

      const res = await chai.request(app).post('/api/profiles/register').send(user);

      expect(res).to.have.status(400);
      expect(res.body).to.include(mockResponse);
    });

    it('should return 400 with invalid email', async () => {
      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Please use a valid email',
      }

      registerUserStub.resolves(mockResponse);

      const user = { email: 'emailtest.com', username: 'amagalla', password: '12345678' };

      const res = await chai.request(app).post('/api/profiles/register').send(user);

      expect(res).to.have.status(400);
      expect(res.body).to.include(mockResponse);
    });

    it('should return 400 with duplicate email', async () => {
      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Email email@email.test already exists',
      }

      const mockInsertUserResp = {
          status: 400,
          error: 'Email email@email.test already exists'
      };

      registerUserStub.resolves(mockInsertUserResp);

      const user = { email: 'email@test.com', username: 'amagalla', password: '12345678' };

      const res = await chai.request(app).post('/api/profiles/register').send(user);

      expect(res).to.have.status(400);
      expect(res.body).to.include(mockResponse);
    });

    it('should return 400 with duplicate username', async () => {
      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Username Yuri already exists',
      }

      const mockInsertUserResp = {
          status: 400,
          error: 'Username Yuri already exists'
      };


      registerUserStub.resolves(mockInsertUserResp);

      const user = { email: 'email@test.com', username: 'yuri', password: '12345678' };

      const res = await chai.request(app).post('/api/profiles/register').send(user);

      expect(res).to.have.status(400);
      expect(res.body).to.include(mockResponse);
    });
  })
})