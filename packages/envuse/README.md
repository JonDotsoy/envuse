# envuse

![](./assets/brand/brand@250w.png)

Module to load environment variables from a `.envuse` file into the `process.env`.

**Sample execution:**

```ts
// run $ npm run -r envuse/register myapp.ts
import config from "envuse";

const API_KEY = config.API_KEY;
```

<details>
  <summary><strong><code>.envuse</code> sample</strong></summary>
  <img src="./assets/sample-syntax-highlighting-for-envuse.png" width="550"/>
</details>

<details>
  <summary><strong>IDE preview:</strong></summary>
  <img src="./assets/ide-preview.png" width="570"/>
  <img src="./assets/ide-preview-2.png" width="700"/>
</details>

## Installation

Install envuse with [npm](https://www.npmjs.com/):

```sh
$ npm install --save envuse
```

## Usage

create a `.envuse` (encoded on UTF8) file in the root of your project, into this file you can add environment variables to be loaded into the `process.env` object.

> preferebly add the `.envuse` file to your `.gitignore` file so that it is not checked into your version control system

Define a variable with a format `VARIABLE_NAME=value` with type definition use `VARIABLE_NAME:type=value`, look at the example below:

```envuse
# .envuse

API_KEY=1234567890
DB_HOST=127.0.0.1
DB_PORT:number=5432
DB_USER=postgres
DB_PASSWORD=postgres
```

In the `.envuse` file can use if sentences to define the variables to be loaded into the `process.env` object. Look at the example below:

```envuse
# .envuse

API_KEY=1234567890

#; if SHELL_SYSTEM === 'windows'
COLOR_TERM:boolean=false
#; fi
```

## Preload

You can use the `-r` in the nodejs command line to preload the `.envuse` file into the `process.env` object. Look at the example below:

```sh
$ node -r envuse/register your-app.js
```

Define the location of the `.envuse` file with the environment variable `ENVUSE_FILE_PATH`:

```sh
$ export ENVUSE_FILE_PATH=path/to/your/envuse/file
$ node -r envuse/register your-app.js
```

or

```sh
$ ENVUSE_FILE_PATH=path/to/your/envuse/file node -r envuse/register your-app.js
```

### Configure in the app script

Load the `envuse` module in your app script to load the `.envuse` file into the `process.env` object.

```ts
import { register } from "envuse";
register();

// ...
```

or

```ts
import "envuse/register";

// ...
```

## Data Source Name (DSN)

The **Data Source Name** is a location of the envuse file in the file system or remote location.

**Sample DSNs:**

- `./.envuse`
- `https://Dc6RHsGaGdfCtA:3kkvgDtuELeg5ztBewlTAdeH@envuse.jon.soy/87e10b76-4200-4e67-8d2e-4715a695cf06`
- `https://sample.host/my_configs/my_envuse.envuse`

> **Custom Headers into requests to the DSN:**
>
> You can add custom headers into request to the DSN using the environment variable `ENVUSE_HEADER_{HEADER_NAME}`.
>
> **Sample:**
>
> ```sh
> $ export ENVUSE_HEADER_FOO="bar"
> $ DEBUG=envuse:* node -r envuse/register my_app.js
> envuse:pull-configuration Pull configuration
> envuse:pull-configuration Download GET https://sample.host/my_configs/my_envuse.envuse
> envuse:pull-configuration          FOO: "bar"
> envuse:pull-configuration Done download in 0.140s [200]
> envuse:load Load 20 configurations
> ```

## parse

Use the parse method to parse a buffer with the content envuse format.

```ts
import { parse } from "envuse";

const buf = Buffer.from("FOO=BAR");

const { parsed } = parse(buf);

console.log(parsed); // { FOO: "BAR" }
```

## parse file

Similar to the parse method, but read and parse the content into file.

```ts
import { parseFile } from "envuse";

const { parsed } = parseFile("my_file.envuse");

console.log(parsed); // { FOO: "BAR" }
```

## create data source (AST)

This method return the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) from a Buffer.

```ts
import { createDataSource } from "envuse";

const buf = Buffer.from("FOO=bar\nBAZ=qux\n", "utf8");

const ast = createDataSource(buf);

console.log(JSON.stringify(ast));
// {
//   "$type": "Block",
//   "pos": 0,
//   "end": 16,
//   "children": [
//     {
//       "$type": "Variable",
//       "pos": 0,
//       "end": 8,
//       "keyVariable": {
//         "$type": "VariableKey",
//         "pos": 0,
//         "end": 3,
//         "value": "FOO"
//       },
//       "valueVariable": {
//         "$type": "VariableValue",
//         "pos": 4,
//         "end": 8,
//         "value": "bar"
//       }
//     },
//     {
//       "$type": "Variable",
//       "pos": 8,
//       "end": 16,
//       "keyVariable": {
//         "$type": "VariableKey",
//         "pos": 8,
//         "end": 11,
//         "value": "BAZ"
//       },
//       "valueVariable": {
//         "$type": "VariableValue",
//         "pos": 12,
//         "end": 16,
//         "value": "qux"
//       }
//     }
//   ]
// }
```

## Contribution

> Before you must not have files compile (`.d.ts`, `.js` and `.js.map`). You can clean the source with the command below.
>
> ```shell
> $ npm run clean
> ```
>
> This command remove only files with extensions `.d.ts`, `.js` and `.js.map`.
