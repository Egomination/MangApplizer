const fs = require("fs");

function createDb(value){
	fs.writeFileSync("db.json", value);
}

module.exports = function (recievedKey, info){
	let obj = {};
	let key = recievedKey;
	obj[key] = [];

	let data = {
		mangaName: info
	}
	let inf = obj[key].push(data);
	let wrable = JSON.stringify(obj); 
	createDb(wrable);
}

