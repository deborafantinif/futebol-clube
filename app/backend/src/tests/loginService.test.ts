import * as chai from 'chai';
import * as Sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { sign } from 'crypto';
import { app } from '../app';
import Users from '../database/models/users';
import JwtService from '../services/jwtService';

chai.use(chaiHttp);

const userMock = {
  id: 1
}

describe('Login',() => {
  beforeEach(() => {
    Sinon.stub(Users, "findOne").resolves(userMock as Users)
    Sinon.stub(JwtService, "sign").resolves('token-value')
  })

  afterEach(() => {
    Sinon.restore()
  })

  it('deve retornar status 200',async () => {
    const response = await chai.request(app).post('/login').send({
      "email": "string",
      "password": "string"
    })
    chai.expect(response).to.have.status(200);

  })

  it('deve retornar no body o token de validação',async() => {
    const response = await chai.request(app).post('/login').send({
      "email": "string",
      "password": "string"
    })

    chai.expect(response.body).to.equal('token-value');
  })
})