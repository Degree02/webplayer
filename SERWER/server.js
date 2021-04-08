const http = require("http");
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const crypto = require('crypto');
const Handler = require("./utils/Handler");
const { respond, formatSizeUnits, getClientID } = require('./utils/Helpers');
const DBInterface = require("./utils/DBInterface");

const PORT = process.env.PORT || 3000;

const handler = new Handler(path.join(__dirname, 'static'), '/');
const db = new DBInterface("playlist.db");

handler.get('/', (req, res) => {
    respond(res, "Hello from Server");
});

handler.get('/admin', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(path.join(__dirname, 'templates', 'admin.html'), (err, data) => {
        respond(res, data);
    });
});

handler.post('/upload', (req, res) => {
    let albumDir;
    do {
        albumDir = path.join(__dirname, 'static', 'albums', 'Album ' + crypto.randomBytes(32).readInt32LE());
    } while (fs.existsSync(albumDir));

    fs.mkdirSync(albumDir);

    const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
        uploadDir: albumDir
    });

    form.parse(req, (err, fields, files) => {
        const uploadedFiles = [];
        if (files.file instanceof Array) {
            uploadedFiles.push(...files.file);
        } else {
            uploadedFiles.push(files.file);
        }

        let imgExists = false;

        uploadedFiles.forEach(file => {
            let newPath;
            if (/image\/jpeg/.test(file.type)) {
                newPath = path.join(albumDir, 'img.jpg');
                imgExists = true;
            } else {
                if (!fs.existsSync(path.join(albumDir, 'mp3'))) {
                    fs.mkdirSync(path.join(albumDir, 'mp3'));
                }
                newPath = path.join(albumDir, 'mp3', file.name);
            }
            fs.rename(file.path, newPath, (err) => {
                if (err) throw err;
            });
        });

        if (!imgExists) {
            fs.copyFile(path.join(__dirname, 'static', 'img.jpg'), path.join(albumDir, 'img.jpg'), () => null)
        }
        respond(res, JSON.stringify(uploadedFiles))
    });
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
        if (!fs.existsSync(albumPath)) {
            respond(res, JSON.stringify([]));
            return;
        }

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
    let clientID = getClientID(req);
    if (!clientID) {
        clientID = crypto.randomBytes(32).toString('hex');
        res.setHeader("Set-Cookie", `clientID=${clientID}; Max-Age=2592000`)
    }
    const data = await db.getPlaylist(clientID);
    res.setHeader("Content-Type", "application/json");
    respond(res, JSON.stringify(data));
});

handler.post('/playlist/add', async (req, res) => {
    const client = getClientID(req);
    if (!client) {
        respond(res, "Start session first :<");
        return;
    }
    await db.addSong(req.body, client);
    respond(res, "OK");
});

handler.post('/playlist/remove', async (req, res) => {
    const client = getClientID(req);
    if (!client) {
        respond(res, "Start session first :<");
        return;
    }
    await db.removeSong(req.body, client);
    respond(res, "OK");
});

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Set-Cookie')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Accept-Ranges', 'bytes');

    handler.passRequest(req, res);
    console.log
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
