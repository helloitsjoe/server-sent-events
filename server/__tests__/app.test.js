/**
 * @jest-environment node
 */
const axios = require('axios');
const createApp = require('../app');

let app;
let host;
let emitter;

beforeEach(async () => {
  emitter = {
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
  };
  app = await createApp(0, emitter);
  host = `http://localhost:${app.address().port}`;
});

afterEach(done => {
  app.close(done);
  jest.clearAllMocks();
});

describe('app', () => {
  describe('/message', () => {
    it('accepts POST requests with messages', async () => {
      const res = await axios.post(`${host}/message`, { message: 'Hello' });
      expect(res.status).toBe(200);
      expect(res.data).toEqual({});
    });

    it('emits message', async () => {
      const message = { name: 'Joe', text: 'Hello' };
      await axios.post(`${host}/message`, { message });
      expect(emitter.emit).toBeCalledWith('message', message);
    });
  });
});
