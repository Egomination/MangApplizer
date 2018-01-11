const fs = require("fs");

function createDb(value) {
    fs.writeFileSync("db.json", value);
}

// TODO: If exist, do not change.
module.exports = function(keys, value) {
    let obj = {};
    let key = keys;
    for (i = 0; i < keys.length; i++) {
        obj[key[i]] = { "url": [value[i]] };
    }
    let wrable = JSON.stringify(obj);
    console.log(wrable);
    createDb(wrable);
}