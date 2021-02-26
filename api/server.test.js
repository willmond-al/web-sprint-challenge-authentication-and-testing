// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(false)
// })
const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const newUser = {username: "test", password:"test"}

beforeAll(async ()=> {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async ()=> {
  await db("users").truncate()
})

afterAll(async ()=>{
  await db.destroy()
})

describe("[POST] /api/auth/register", ()=>{
  it("responds with 201 status", async ()=> {
   const res = await request(server).post("/api/auth/register").send(newUser)
    expect (res.status).toBe(201)
  })
})

describe("[POST] /api/auth/login", ()=>{
  it("responds with a 200 status", async () =>{
    await request(server).post("/api/auth/register").send(newUser)
    const res = await request(server).post("/api/auth/login").send(newUser)
    expect(res.status).toBe(200)
  })
})

describe("[GET] /api/jokes", ()=>{
  it("responds with a 200 status", async () =>{
    // await request(server).post("/api/auth/register").send(newUser)
    // await request(server).post("/api/auth/login").send(newUser)
    // const res = await request(server).get("/api/jokes").send()
    // expect(res.status).toBe(200)
  })
})
