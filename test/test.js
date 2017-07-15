const test = require('tape');
const { router } = require('..');

test('test', t => {
  t.plan(6);

  const echoLambda = (event, context, callback) => callback(null, event);
  const errorLambda = (event, context, callback) => callback(new Error());

  const pambda = router()
    .get('/', next => echoLambda)
    .get(['/array/0', '/array/1'], next => echoLambda)
    .toPambda();

  const lambda = pambda(errorLambda);

  lambda({ path: '/', httpMethod: 'GET' }, {}, (err, result) => {
    t.error(err);

    t.equal(result.path, '/');
  });

  lambda({ path: '/array/0', httpMethod: 'GET' }, {}, (err, result) => {
    t.error(err);

    t.equal(result.path, '/array/0');
  });

  lambda({ path: '/array/1', httpMethod: 'GET' }, {}, (err, result) => {
    t.error(err);

    t.equal(result.path, '/array/1');
  });
});
