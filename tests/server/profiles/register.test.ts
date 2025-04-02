import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app/server/index';
import db from '../../../app/server/db/mysql.config';
import { MySQLError } from '../configs/mysqlError';

const chai = use(chaiHttp);

describe('POST /api/profiles/register', () => {
  let queryStub: sinon.SinonStub;

  const ROUTE = '/api/profiles/register';

  beforeEach(() => {
    queryStub = sinon.stub(db, 'query');
  });

  afterEach(() => {
    queryStub.restore();
  });

  context('User should not register', () => {
    it('should error when email is not entered', async () => {
      const user = { email: '', password: 'abcd1234' };

      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Email required'
      };
      
      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(400);
      expect(resp.body).to.include(mockResponse);

    });
    
    it('should error when email is not valid', async () => {
      const user = { email: 'email.test', password: 'abcd1234' };

      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Please use a valid email'
      };
      
      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(400);
      expect(resp.body).to.include(mockResponse);
    });
    
    it('should error when password is not entered', async () => {
      const user = { email: 'email@email.test', password: '' };

      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Password is required'
      };
      
      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(400);
      expect(resp.body).to.include(mockResponse);
    });
    
    it('should error when password is too short', async () => {
      const user = { email: 'email@email.test', password: 'abcs123' };

      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Password needs to be between 8 to 64 characters long'
      };
      
      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(400);
      expect(resp.body).to.include(mockResponse);
    });
    
    it('should error when password is too long', async () => {
      const user = { email: 'email@email.test', password: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' };

      const mockResponse = {
        success: false,
        statusCode: 400,
        message: 'Password needs to be between 8 to 64 characters long'
      };
      
      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(400);
      expect(resp.body).to.include(mockResponse);
    });

    it('should error when an email already exists', async () => {
      const user = { email: 'email@email.test', password: 'abcd1234' };

      const mockResponse = {
        success: false,
        statusCode: 400,
        message: "Email email@email.test already exists"
      }

      const mockError = new MySQLError(
        "Duplicate entry 'email@email.test' for key 'profiles.email'",
        'ER_DUP_ENTRY',
      );

      queryStub.rejects(mockError);

      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(400);
      expect(resp.body).to.include(mockResponse);
    })
  });

  context('User should register', () => {
    it('user should register successfully', async () => {
      const user = { email: 'email@email.test', password: 'abcd1234' };

      const mockResponse = {
        success: true,
        statusCode: 200,
        message: 'User registered successfully',
        profile_id: 6
      };

      const mockQueryResult = {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 6,
          info: '',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0
        }

      queryStub.resolves([mockQueryResult]);

      const resp = await chai.request(app).post(ROUTE).send(user);

      expect(resp.status).to.equal(200);
      expect(resp.body).to.deep.equal(mockResponse);
    });
  });
});