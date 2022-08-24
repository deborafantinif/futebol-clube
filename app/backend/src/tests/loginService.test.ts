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
  id: 1,
  role: 'admin'
}

describe('Login',() => {
  describe('Login router', () => {
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

  describe('Validate router', () => {
    beforeEach(() => {
      Sinon.stub(Users, "findByPk").resolves(userMock as Users)
      Sinon.stub(JwtService, "verify").resolves({ id: 1 })
    })
  
    afterEach(() => {
      Sinon.restore()
    })
  
    it('deve retornar status 200',async () => {
      const response = await chai.request(app).get('/login/validate')
        .set('authorization', 'token-value')
      chai.expect(response).to.have.status(200);
  
    })
  
    it('deve retornar no body o tipo de autorização do usuário [role]',async() => {
      const response = await chai.request(app).get('/login/validate')
        .set('authorization', 'token-value')
  
      chai.expect(response.body).to.equal({ role: "admin" });
    })
  })
})