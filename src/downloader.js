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

module.exports = function(url, name, chNo) {
    url = url.filter((i) => i);
    let path = createFolders(name, chNo);
    // Waiting folder creation
    setTimeout(function() {
        url.forEach(function(item) {
            item = item.trim();
            console.log(item);
            let chapters = item.split("/").pop(-1).toLowerCase();
            let chapNumbers = path + chapters;
            let file = fs.createWriteStream(chapNumbers);
            http.get(item, function(response) {
                response.pipe(file);
            });
        });
    }, 2000);
};
