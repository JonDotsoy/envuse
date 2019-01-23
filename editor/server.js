const http = require('http');
const url = require('url');
const httpErros = require('http-errors');
const chalk = require('chalk');
const fs = require('fs');
const opn = require('opn');
const ConfigStore = require('../ConfigStore');

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {(req: IncomingMessage, res: ServerResponse) => void} Handle
 */

const cwd = process.cwd();

const configStore = new ConfigStore({
    cwd,
});

const app = {
    /** @type {[RegExp, Handle][]} */
    routers: [],
    /**
     * @param {RegExp} exp
     * @param {Handle} handle
     */
    use(exp, handle) {
        this.routers.push([exp, handle]);
    },
    /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    match(req, res) {
        const keyMatch = `${req.method} ${req.url}`;

        const routeFound = this.routers.find(([exp]) => {
            const found = exp.test(keyMatch);
            if (found) {
                req.expResult = exp.exec(keyMatch);
            }
            return found;
        });

        if (!routeFound) {
            res.statusCode = 404;
            return res.end();
        }

        const [, handle ] = routeFound;

        handle(req, res);
    },
}

app.use(/^GET \/api\/config\/(?<configName>.+)$/i, (req, res) => {
    const conf = req.expResult;
    res.statusCode = "200";
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(
        {
            regex: { ...conf },
            configs: configStore.getConfig(conf.groups.configName),
        }
    ));
    return res.end();
});

const parseBody = (req) => new Promise((resolve, reject) => {
    const body = [];

    req
        .on('data', chunk => { body.push(chunk); })
        .on('error', err => reject(err))
        .on('end', () => {
            resolve(Buffer.concat(body));
        });
})

app.use(/^POST \/api\/config\/(?<configName>.+)$/i, async (req, res) => {
    try {

        if (req.headers["content-type"] !== 'application/json') {
            res.statusCode = "405";
            return res.end();
        }
        
        const newConfig = JSON.parse(await parseBody(req));
        const configName = req.expResult.groups.configName;

        configStore.setConfig(configName, newConfig);

        res.statusCode = "202";
        res.setHeader('Content-type', 'application/json');
        return res.end();
    } catch (ex) {
        console.error(ex.stack || ex);
        res.statusCode = "500";
        return res.end();
    }
});

app.use(/^GET \/api\/config$/, (req, res) => {
    res.statusCode = "200";
    res.setHeader('Content-type', 'application/json');
    res.write(JSON.stringify(
        configStore.getConfigs().map(e => ({
            ...e
        })),
    ));
    return res.end();
});

app.use(/^GET \/$/, (req, res) => {
    res.statusCode = "200";
    res.setHeader('Content-type', 'text/html');
    res.write(fs.readFileSync(`${__dirname}/index.html`));
    return res.end();
});

const server = http.createServer((req, res) => {
    app.match(req, res);

    console.log(chalk`[${res.statusCode}] {green ${req.method}} {green ${req.url}}`);
});

server.listen(60094, function () {
    const port = server.address().port;
    const address = server.address().address;

    const link = url.format({
        protocol: 'http',
        slashes: true,
        port,
        hostname: address,
    });

    console.log(chalk`Open {green ${link}} to edit`);
    console.log('Press Ctrl+C to close')
    // opn(link);
});
