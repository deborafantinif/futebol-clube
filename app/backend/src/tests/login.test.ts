import {app} from '../app'
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Users from '../database/models/users'
import Sinon from 'sinon';

chai.use(chaiHttp);

describe('Login',() => {
  beforeAll(() => {
    Sinon.stub(Users, "findOne")
  })

  afterAll(() => {
    Sinon.restore()
  })

  it('deve retornar status 200',async () => {
    const response = await chai.request(app).post('/login').send({
      "email": "string",
      "password": "string"
    })

    expect(response.status).to.equal(200)
  })

  it('deve retornar no body o token de validação',async() => {
    const response = await chai.request(app).post('/login').send({
      "email": "string",
      "password": "string"
    })

    expect(response.body).to.equal('token-value')
  })
})