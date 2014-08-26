# uver

Bump the version on package.json and other files

## CLI

To bump file versions from the command-line, check [uver-cli](https://github.com/flesler/uver-cli)

## Installation

``` bash
$ npm install uver
```

## Basic usage

```js
var uver = require('uver');
var newVersion = uver({ /* options */ });
// package.json version was incremented and saved
```

`uver` can receive an object with options (none required):
- `patch: true`: Update patch version (this is the default)
- `minor: true`: Update minor version
- `major: true`: Update major version
- `index: 1`: Update the version on the specified index (0 for major)
- `revert: true`: Decrement instead of increment
- `root: './files'`: Where to look for the source file (default is $CWD)
- `filename: 'bower.json'`: Filename of the source (default is package.json)
- `ver: '1.2.3'`: Specify a fixed version
- `output: './package.json.bkp'`: Where to save the file (default is override source)
- `stream: process.stdout`: Output file to a stream instead of source

You can also pass the `version` directly as the argument:
```js
uver('1.2.3');
```

## Some notes

- Given more than one out of `major`, `minor` and `patch`, only the "highest" will be updated.
- Updating a component will reset to 0 all the ones on the right (1.1.1 -> 1.2.0 and not 1.2.1)

## Why not npm version

[npm version](https://www.npmjs.org/doc/cli/npm-version.html) is pretty cool and I used it as a reference to write this module.

One of the problems is it also:
- Creates a commit
- Creates a tag for that commit

There's currently no way to prevent these 2 from happening as well.

Also, npm version doesn't allow reverting (decrementing) a version.

## Tests

``` bash
$ npm test
```

## TODO
- See if viable to rely on [semver](https://github.com/npm/node-semver) to update the version. It's much more solid but doesn't allow decrementing.
- Support pre-release and similar?

## LICENSE

The MIT License (MIT)

Copyright (c) 2014 Ariel Flesler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
