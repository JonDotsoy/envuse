# Specification

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://tools.ietf.org/html/bcp14) [RFC2119](https://tools.ietf.org/html/rfc2119) [RFC8174](https://tools.ietf.org/html/rfc8174) when, and only when, they appear in all capitals, as shown here.

## Introduction

The envuse specification define how to write and read a `.envuse` file.

## Definition

### Envuse Document

A Document that define an config store.

#### Media Types

Some examples of posibles media type definitions:

```
text/plain; charset=utf-8
application/envuse
application/vnd.envuse
```

## Specification

### Comments

The comment start with the `#` symbol and closes with the new line (`\n`).

Sample the the a comment.

```envuse
# I am comment
```

### Variable

The variables declare a configuration with a type. this definition is used to load the configuration from the envuse file or the environment.

Sample of variable line:

```envuse
foo: string = `var`
```

### Variable Type

The type definition declares how to deserialize the value.

Primitive types:

- `number`
- `string`: It's used by default if the variable is not declared.
- `boolean`
- `json`
- `array`
