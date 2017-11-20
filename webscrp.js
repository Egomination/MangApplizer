var request = require('request');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
var mkdirp = require('mkdirp');
var readline = require('readline');


let list = [];


// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("Url, foldername, chaptername ", function(answer) {
//   // TODO: Log the answer in a database
//   // download(answer);
//   let stringify = answer.split(' ');
//   download(stringify[0], stringify[1], stringify[2])
//   rl.close();
// });

function download(url, foldername, chname){
	mkdirp('./imgs/' + foldername + '/' + chname + '/');
	request(url, function(err, resp, body) {
		// First we get the image urls from lhscans.
	      const $ = cheerio.load(body);
	      $(body).find('img.chapter-img').each(function(index, element) {
	      	let info = ($(element).attr('src'));
	      	list.push(info);
	      });
	    	// Creating the folders for the chapter.
	    // Downloading the each link
	    list.forEach(function(item, url){
	    	let val = item.trim();
	    	// Downloadin the images.

    		let file = fs.createWriteStream('./imgs/'+ foldername + '/' + chname + '/' +
    			val.split('/').pop(-1).toLowerCase());
    		let req = http.get(val, function(response) {
        		response.pipe(file)
	    	});

		});
	});
}

module.exports = {
	download: download
}