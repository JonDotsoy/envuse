import { CommandModule } from 'yargs';
declare type c = CommandModule<{}, {
    app?: string;
    cwd: string;
    'heroku-app'?: string;
}>;
declare const _default: c;
export = _default;
