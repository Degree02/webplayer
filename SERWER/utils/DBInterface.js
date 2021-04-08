const DBStore = require('nedb');

class DBInterface {
    constructor(file) {
        this.db = new DBStore({ filename: file, autoload: true });
    }

    getPlaylist(client) {
        return new Promise(resolve => {
            this.db.find({ clientID: client }, (err, docs) => {
                const clientDoc = docs.pop();
                resolve(clientDoc ? clientDoc.playlist : []);
            });
        });
    }

    addSong(song, client) {
        return new Promise(resolve => {
            this.db.update({ clientID: client }, { $push: { playlist: song } }, { upsert: true }, (err, result) => {
                resolve(result);
            });
        });
    }

    removeSong(song, client) {
        return new Promise(resolve => {
            this.db.update({ clientID: client }, { $pull: { playlist: { name: song.name } } }, (err, result) => {
                resolve(result);
            });
        });
    }
}

module.exports = DBInterface;