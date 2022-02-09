const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  email: 'test@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('User route tests', () => {

  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users/register').send(mockUser);
    const { email } = mockUser;
    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('logs in a mock user', async () => {
    const [agent] = await registerAndLogin();
    const sessions = await agent.post('/api/v1/users/login').send(mockUser);
    expect(sessions.body).toEqual({
      message: 'Log-in Successful'
    });
  });

  // it('logs out a mock user by deleting a session', async () => {
  //   const [agent, user] = await registerAndLogin();
  //   const sessions = await agent.get('/api/v1/sessions');
  //   console.log(sessions.body);
  //   expect(sessions.body).toEqual({
  //     ...user,
  //     exp: expect.any(Number),
  //     iat: expect.any(Number),
  //   });

  // });

});
