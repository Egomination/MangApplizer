const http = require("http");
const fs = require("fs");
const mkdirp = require("mkdirp-promise");

function createFolders(name, chNo) {
    let filePath = "../../imgs/" + name + "/" + chNo + "/";
    mkdirp(filePath)
        .then(console.log)
        /*
            Returns path if it's created -> workEnvironment/projects/development/Elec/imgs/G Men - Raw
            returns null, if path is already exist.
        */
        .catch(console.error);
    return filePath;
}

function downloader(url, path) {
    let chapters = url.split("/").pop(-1).toLowerCase();
    let chapNumbers = path + chapters;
    let file = fs.createWriteStream(chapNumbers);
    http.get(url, function(response) {
        response.pipe(file);
    });
}

module.exports = {
    downloader: downloader,
    createFolders: createFolders
};