const request = require('request');
const cheerio = require('cheerio');
const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');


let list = [];

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