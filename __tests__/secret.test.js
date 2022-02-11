const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockSecret = {
  title: 'secret title',
  description: 'this is a secret shhh'
};

const mockUser = {
  email: 'admin',
  password: '12345',
};

const registerAndLogin = async () => {
  const password = mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser });
  const { email } = user;
  await agent.post('/api/v1/users/login').send({ email, password });
  await agent.post('/api/v1/secrets').send({ ...mockSecret, user_id: user.id });
  return [agent, user];
};



describe('Secret route tests', () => {

  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('allows a logged in user to create a secret', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.post('/api/v1/secrets').send({ ...mockSecret, user_id: user.id });
    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      userId: expect.any(String),
      ...mockSecret,
    });
  });


  it('allows a logged in user to GET a list of all secrets', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.body).toEqual([{
      createdAt: expect.any(String), 
      description: 'this is a secret shhh', 
      id: expect.any(String), 
      title: 'secret title', 
      userId: '1' }]);
  });

});
