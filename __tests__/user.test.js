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
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
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

  it('logs a user out', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/login').send(mockUser);

    expect(res.body).toEqual({
      success: true,
      message: 'Logged out successfully!',
    });
  });


});
