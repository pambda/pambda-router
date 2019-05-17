# pambda-router

[Pambda](https://github.com/pambda/pambda) for routing.

## Installation

```
npm i pambda-router
```

## Usage

``` javascript
import { compose, createLambda } from 'pambda';
import { router } from 'pambda-router';

export const handler = createLambda(
  compose(
    router()
      .get('/', next => (event, context, callback) => {
      })
      .toPambda()
  )
);
```

## router()

Create a Router instance.

## Router

### HTTP_METHOD(path, pambda)

Specify Pambda when a request for a method specified by `HTTP_METHOD` arrives for the resource specified by `path`.

The following can be specified as `HTTP_METHOD`:

- `head`
- `get`
- `post`
- `put`
- `delete`
- `patch`
- `options`

For the format of `path`, see [path-to-regexp](https://github.com/pillarjs/path-to-regexp#readme).

### all(path, pambda)

Specify Pambda when any method request arrived for the resource specified by `path`.

### toPambda()

Returns Pambda which synthesized routings.

## License

MIT
