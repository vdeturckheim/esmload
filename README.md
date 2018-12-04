# esmload

This module can be use to mock the results of a native ES6 import in Node.js.

## Install

```bash
$ npm i -D esmload
```

## Usage

* Node.js process needs to be started with the following flags:
```bash
$ node --experimental-modules --loader esmload <index.mjs>
```
* After that, all imported modules will have an export named `'TEST_MOCK'`:
```js
import { main, TEST_MOCK } from './lib1.mjs';
```

`TEST_MOCK` is a map:
* each entry has the name of an export from the module.
* each value is a Proxy handler that can be used to manipulate the linked export.

## Example

```js
// lib1.mjs
export function main() {
    return 'hello World!';
}
```

```js
// index.mjs
import { main, TEST_MOCK } from './lib1.mjs';

console.log(main()); // prints 'hello World!'
const mainProxyHandler = TEST_MOCK.get('main');
mainProxyHandler.apply = function(target, self, args) {
    return Reflect.apply(target, self, args) +  '!!';
}
console.log(main()); // prints 'hello World!!!'
mainProxyHandler.apply = undefined;
console.log(main()); // prints 'hello World!'
```

See tests for other examples.

## Limitations
Right now, you can't mock something that is not an object.

## Status
This is a PoC I just wrote in a couple hours. Next steps may include:
* [ ] provide a higher level interface hide the proxies to most users
* [ ] propose a dependency injection system with the same bases
* [ ] inline that in a test framework somehow

