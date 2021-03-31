const DBStore = require('nedb');

class DBInterface {
    constructor(file) {
        this.db = new DBStore({ filename: file, autoload: true});
    }

    getPlaylist() {
        return new Promise(resolve => {
            this.db.find({}, (err, docs) => {
                resolve(docs);
            });
        });
    }

    addSong(song) {
        return new Promise(resolve => {
            this.db.insert(song, (err, result) => {
                resolve(result);
            });
        });
    }

    removeSong(song) {
        return new Promise(resolve => {
            this.db.remove({ name: song.name }, (err, result) => {
                resolve(result);
            });
        });
    }
}

module.exports = DBInterface;