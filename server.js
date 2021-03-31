const http = require("http");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Handler = require("./utils/Handler");
const { respond, formatSizeUnits } = require('./utils/Helpers');
const DBInterface = require("./utils/DBInterface");

const PORT = process.env.PORT || 3000;

const handler = new Handler(path.join(__dirname, 'static'), '/');
const db = new DBInterface("playlist.db");

handler.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'pages', 'index.html');
    if (fs.existsSync(indexPath)) {
        const data = fs.readFileSync(path.join(__dirname, 'pages', 'index.html'));
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.write(data);
        res.end();
        return;
    }

    res.writeHead(404);
    res.write('No index page');
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

handler.get('/playlist', async (req, res) => {
    const data = await db.getPlaylist();
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(data));
    res.end();
});

handler.post('/playlist/add', async (req, res) => {
    await db.addSong(req.body);
    res.end("OK");
});

handler.post('/playlist/remove', async (req, res) => {
    await db.removeSong(req.body);
    res.end("OK");
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Accept-Ranges', 'bytes');

    handler.passRequest(req, res);
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
