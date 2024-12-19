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
    it('should ran error when a username already exists', async () => {
      const user = { email: 'email@email.test', username: 'amagalla', password: 'abcd1234' };

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

      const res = await chai.request(app).post(ROUTE).send(user);

      expect(res.status).to.equal(400);
      expect(res.body).to.include(mockResponse);
    })
  });
});