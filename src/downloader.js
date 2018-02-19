const http = require("http");
const fs = require("fs");
const mkdirp = require("mkdirp-promise");

/**
 * Creates the manga folder with repsect to name and its chapter
 * @param  {String} name Name of the manga
 * @param  {String} chNo Chapter no of the manga
 * @return {String}      path of the folder that created.
 */
function createFolders(name, chNo) {
    const filePath = "../../imgs/" + name + "/" + chNo + "/";
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
    const path = createFolders(name, chNo);
    // Waiting folder creation
    setTimeout(function() {
        url.forEach(function(item) {
            item = item.trim();
            console.log(item);
            const chapters = item.split("/").pop(-1).toLowerCase();
            const chapNumbers = path + chapters;
            const file = fs.createWriteStream(chapNumbers);
            http.get(item, function(response) {
                response.pipe(file);
            });
        });
    }, 2000);
};
