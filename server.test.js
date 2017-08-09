const test = require('tape');
const request = require('supertest');
const app = require('./server');

test('get /', t => {
  request(app)
    .get('/')
    .expect(200)
    .expect('Content-Type', /html/)
    .end(err => {
      const msg = 'should return 200 ok'
      if (err) return t.fail(msg);
      t.pass(msg);
      t.end();
    });
});
