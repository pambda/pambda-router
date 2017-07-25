# pambda-router

ルーティングのための Pambda.

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

## router()

Router インスタンスを作成する。

## Router

### HTTP_METHOD(path, pambda)

`path` で指定したリソースに対して `HTTP_METHOD` で指定したメソッドのリクエストが来た時の Pambda を指定する。

`HTTP_METHOD` として以下を指定できる。

- `head`
- `get`
- `post`
- `put`
- `delete`
- `patch`
- `options`

`path` の書式は [path-to-regexp](https://github.com/pillarjs/path-to-regexp#readme) を参照。

### all(path, pambda)

`path` で指定したリソースに対して任意のメソッドのリクエストが来た時の Pambda を指定する。

### toPambda()

設定したルーティングを合成した Pambda を返す。

## License

MIT
