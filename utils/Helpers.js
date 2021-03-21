module.exports = {
    badRequest: res => {
        res.writeHead(400);
        res.write("Bad Request")
        res.end();
    },

    respond: (res, payload) => {
        res.writeHead(200);
        res.write(payload);
        res.end();
    },

    formatSizeUnits: (bytes) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
}
