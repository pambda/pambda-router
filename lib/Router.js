const pathToRegexp = require('path-to-regexp');
const { compose } = require('pambda');
const { callbackify } = require('lambda-callbackify');

class Router {
  constructor() {
    this._routes = [];
  }

  _addRoute(method, path, pambda) {
    if (Array.isArray(path)) {
      path.forEach(path => this._addRoute(method, path, pambda));
      return;
    }

    const keys = [];
    const re = pathToRegexp(path, keys);

    this._routes.push({
      keys,
      method,
      path,
      pambda,
      re,
    });
  }

  head(path, pambda) {
    this._addRoute('HEAD', path, pambda);
    return this;
  }

  get(path, pambda) {
    this._addRoute('GET', path, pambda);
    return this;
  }

  post(path, pambda) {
    this._addRoute('POST', path, pambda);
    return this;
  }

  put(path, pambda) {
    this._addRoute('PUT', path, pambda);
    return this;
  }

  delete(path, pambda) {
    this._addRoute('DELETE', path, pambda);
    return this;
  }

  patch(path, pambda) {
    this._addRoute('PATCH', path, pambda);
    return this;
  }

  options(path, pambda) {
    this._addRoute('OPTIONS', path, pambda);
    return this;
  }

  all(path, pambda) {
    this._addRoute('*', path, pambda);
    return this;
  }

  toPambda() {
    return compose.apply(null, this._routes.map(routeToPambda));
  }
}

function routeToPambda(route) {
  return next => {
    next = callbackify(next);

    return (event, context, callback) => {
      if (route.method !== '*' && route.method !== event.httpMethod) {
        return next(event, context, callback);
      }

      const match = route.re.exec(event.path);
      if (!match) {
        return next(event, context, callback);
      }

      if (!event.pathParameters) {
        event.pathParameters = {};
      }

      const params = event.pathParameters;
      const { keys } = route;

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = match[i + 1];

        const decodedValue = decode(value);

        if (decodedValue === null) {
          return badRequest(callback);
        }

        params[key] = decodedValue;
      }

      const lambda = route.pambda(next);

      lambda(event, context, callback);
    };
  };
}

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return null;
  }
}

function badRequest(callback) {
  callback(null, {
    statusCode: 400,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: 'Bad request',
  });
}

exports.Router = Router;
