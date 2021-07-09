# `$ envuse`

The `envuse` is a client to choose a environment into your project.

[Contributors](https://github.com/JonDotsoy/envuse/graphs/contributors)

## How to use

Please install with `npm i -g envuse`

## Command Topics

- [`$ envuse ls`](#command-envuse-ls) — List the environments origin joined.
- [`$ envuse add`](#command-envuse-add) — Add a new environment origin.
- [`$ envuse pull`](#command-envuse-pull) — Synchronize the selected environment with the remote environment origin.
- [`$ envuse rm`](#command-envuse-rm) — Remove an environment origin.
- [`$ envuse select`](#command-envuse-select) — Choose an environment origin.
- [`$ envuse sync`](#command-envuse-sync) — Synchronize all environments' origin.

<span id="command-envuse-ls"></span>

## Command `$ envuse ls`

List the environments origin joined.

<span id="command-envuse-add"></span>

## Command `$ envuse add`

Add a new environment origin.

<span id="command-envuse-pull"></span>

## Command `$ envuse pull`

Synchronize the selected environment with the remote environment origin.

<span id="command-envuse-rm"></span>

## Command `$ envuse rm`

Remove an environment origin.

<span id="command-envuse-select"></span>

## Command `$ envuse select`

Choose an environment origin.

<span id="command-envuse-sync"></span>

## Command `$ envuse sync`

Synchronize all environments' origin.

## Integrations

With Envuse project, Allow integrations with another platform as Heroku.

> This is an **experimental** feature, please if not work put an issue post with the problem.

### Heroku

This integration uses the [Heroku client](https://github.com/heroku/cli "Heroku CLI") to obtain the configuration from a project hosted in Heroku.

## Contribution

> Before you must not have files compile (`.d.ts`, `.js` and `.js.map`). You can clean the source with the command below.
>
> ```shell
> $ rm src/**/*.{js,js.map,d.ts}
> ```
>
> This command remove only files with extensions `.d.ts`, `.js` and `.js.map`.
