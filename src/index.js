import pathToRegexp from 'path-to-regexp';
import { compose } from 'pambda';

export const router = () => {
  const routes = [];

  const addRoute = (method, path, pambda) => {
    const keys = [];
    const re = pathToRegexp(path, keys);

    routes.push({
      keys,
      method,
      path,
      pambda,
      re,
    });
  };

  return {
    get(path, pambda) {
      addRoute('GET', path, pambda);
      return this;
    },

    post(path, pambda) {
      addRoute('POST', path, pambda);
      return this;
    },

    put(path, pambda) {
      addRoute('PUT', path, pambda);
      return this;
    },

    delete(path, pambda) {
      addRoute('DELETE', path, pambda);
      return this;
    },

    patch(path, pambda) {
      addRoute('PATCH', path, pambda);
      return this;
    },

    options(path, pambda) {
      addRoute('OPTIONS', path, pambda);
      return this;
    },

    all(path, pambda) {
      addRoute('*', path, pambda);
      return this;
    },

    toPambda() {
      return compose.apply(null, routes.map(routeToPambda));
    },
  };
};

function routeToPambda(route) {
  return next => (event, context, callback) => {
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
