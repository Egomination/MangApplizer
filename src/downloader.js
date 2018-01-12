const http = require("http");
const fs = require("fs");

// TODO: Add chNo
// TODO: Fix enoent,no folder available, issue wth creating path beforehand.
module.exports = function(url, name /*,path*/ ) {
    let file = fs.createWriteStream("../../imgs/" + name + "/" + url.split("/").pop(-1)
        .toLowerCase());
    let download = http.get(url, function(response) {
        response.pipe(file);
    });
};