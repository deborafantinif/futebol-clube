import * as chai from 'chai';
import * as Sinon from 'sinon';
import { app } from '../app';
import Matches from '../database/models/matches';
import Users from '../database/models/users';
import JwtService from '../services/jwtService';
// @ts-ignore
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

// const matchMock = [{
//   id: 1,
//   homeTeam: 16,
//   homeTeamGoals: 1,
//   awayTeam: 8,
//   awayTeamGoals: 1,
//   inProgress: false,
//   teamHome: {
//     teamName: "São Paulo"
//   },
//   teamAway: {
//     teamName: "Grêmio"
//   }
// }]

describe('Match',() => {
  describe('getAll router', () => {
    beforeEach(() => {
      Sinon.stub(Matches, "findAll")
    })
  
    afterEach(() => {
      Sinon.restore()
    })
  
    it('deve retornar status 200',async () => {
      const response = await chai.request(app).get('/matches')
      chai.expect(response).to.have.status(200);
  
    })
  
    // it('deve retornar no body o token de validação',async() => {
    //   const response = await chai.request(app).post('/login').send({
    //     "email": "string",
    //     "password": "string"
    //   })
  
    //   chai.expect(response.body).to.equal('token-value');
    // })
  })

  describe('update router', () => {
    beforeEach(() => {
      Sinon.stub(Matches, "update")
    })
  
    afterEach(() => {
      Sinon.restore()
    })
  
    it('deve retornar status 200',async () => {
      const response = await chai.request(app).patch('/matches/1')
        .send({
          "homeTeamGoals": 3,
          "awayTeamGoals": 1
        })
      chai.expect(response).to.have.status(200);
  
    })
  
    it('deve retornar no body mensagem confirmando autorização',async() => {
      const response = await chai.request(app).patch('/matches/1')
        .send({
          "homeTeamGoals": 3,
          "awayTeamGoals": 1
        })
  
      chai.expect(response.body).to.equal({ message: 'Updated' });
    })
  })
})