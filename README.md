# pambda-router

## Installation

```
npm i pambda-router -S
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

## License

MIT
