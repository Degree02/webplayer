const http = require("http");
const fs = require('fs');
const path = require('path');
const Handler = require("./utils/Handler");
const { respond, formatSizeUnits } = require('./utils/Helpers');

const PORT = process.env.PORT || 3000;

const handler = new Handler(path.join(__dirname, 'static'), '/');

handler.get('/', (req, res) => {
    res.setHeader('Location', '/dist/index.html');
    res.writeHead(301);
    res.end();
});

handler.post('/files', (req, res) => {
    const result = {};
    const albumsPath = path.join(__dirname, 'static', 'albums')
    const dirs = fs.readdirSync(albumsPath);
    let albumPath;
    if (req.body.action == "FIRST") {
        result.dirs = dirs;
        albumPath = path.join(albumsPath, result.dirs[0], 'mp3');
        result.files = fs.readdirSync(albumPath);
    } else {
        const album = dirs.find(dir => dir == req.body.name);
        albumPath = path.join(albumsPath, album, 'mp3')
        if (album) {
            result.files = fs.readdirSync(albumPath);
        }
    }
    result.files = result.files.map(file => {
        const stats = fs.statSync(path.join(albumPath, file));
        return { name: file, size: formatSizeUnits(stats.size) };
    });

    res.setHeader('Content-type', 'application/json');
    respond(res, JSON.stringify(result));
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    handler.passRequest(req, res);
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
