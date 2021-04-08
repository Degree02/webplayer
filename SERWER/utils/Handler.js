const { badRequest } = require("./Helpers");
const path = require('path');
const fs = require('fs');

class Handler {
    constructor(staticPath, staticUrl) {
        this.binds = {
            get: {},
            post: {}
        }
        this.staticPath = staticPath;
        this.staticUrl = staticUrl;
    }

    get(path, callback) {
        this.binds.get[path] = callback;
    }

    post(path, callback) {
        this.binds.post[path] = (req, res) => {
            if (/multipart\/form-data/.test(req.headers['content-type'])) {
                callback(req, res);
                return;
            }
            let body = "";
            req.on('data', data => {
                body += data.toString();
            });
            req.on('end', () => {
                req.body = JSON.parse(body);
                callback(req, res);
            })
        }
    }

    passRequest(req, res) {
        let handlers;
        switch (req.method) {
            case 'GET':
                handlers = this.binds.get;
                break;
            case 'POST':
                handlers = this.binds.post;
                break;
            default:
                badRequest(res);
                return;
        }

        if (handlers[req.url] == undefined) {
            const uriRegex = new RegExp(`^${this.staticUrl}.*`);
            if (uriRegex.test(req.url)) {
                const filePath = path.join(this.staticPath, ...decodeURI(req.url).split('/'));
                if (fs.existsSync(filePath)) {
                    const data = fs.readFileSync(filePath);
                    if (!data) {
                        badRequest();
                        return;
                    }

                    if (/.css$/.test(req.url)) {
                        res.setHeader('Content-Type', 'text/css');
                    } else {
                        res.setHeader('Content-Disposition', 'inline');
                    }
                    res.setHeader('Content-Length', data.byteLength);
                    res.write(data);
                    res.end();
                    return;
                }
            }

            badRequest(res);
            return;
        }

        handlers[req.url](req, res);
    }
}

module.exports = Handler;
