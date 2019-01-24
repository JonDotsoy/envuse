# `envuse`

The `envuse` is a client to choose a environment into your project.

## how to use
Please install with `npm i -g envuse`

```shell
$ npm i -g envuse
$ touch .config-1.env
$ touch .config-2.env
$ touch .config-3.env
$ envuse
# project-name
? Select config config-1
# copy project-name/.config-1.env to
# project-name/.env
```
