const fs = require("fs");

/**
 * Creates the json file
 * @param  {Obj} data Javascript object which contains the json info
 * @return {void}
 */
function createLog(data) {
    if (fs.existsSync("../../log.json")) {
        console.log("Path is already exists");
        // fs.appendFile("../../log.json", data);
    } else {
        // fix this Depricated
        fs.writeFile("../../log.json", data, (err) => {
            if (err) { throw err; }
        });
    }
}

/**
 * Inserts new manga int ojson
 * @param  {Obj} data Javascript object that contains json info
 * @return {void}
 */
function insertInto(data) {
    try {
        JSON.parse(fs.readFileSync("./../../log.json"));
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("No file Found!");
            console.log(data);
            createLog(JSON.stringify(data));
        }
    }
    setTimeout(function() {
        let testVar = JSON.parse(fs.readFileSync("./../../log.json"));
        testVar.LastDownloads.push(data.LastDownloads[0]);
        testVar = JSON.stringify(testVar);
        console.log(testVar);

        fs.writeFile("../../log.json", testVar, (error) => {
            if (error) { return console.log(error); }
        });
    }, 2000);
}

module.exports = function(mangaName, chNo, host) {
    const obj = {
        LastDownloads: []
    };
    obj.LastDownloads.push({
        Name: mangaName,
        ChapterNo: chNo,
        Source: host
    });
    insertInto(obj);
};