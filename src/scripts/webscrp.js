const request = require('request');
const cheerio = require('cheerio');
const http = require('http');
const mkdirp = require('mkdirp-promise')
const fs = require('fs-extra')
const readline = require('readline');


let list = [];

function download(url, foldername, chname){
	let mpath = './imgs/' + foldername + '/' + chname + '/';
	mkdirp(mpath)
		.catch(console.error);
	request(url, function(err, resp, body) {
		// First we get the image urls from lhscans.
	      const $ = cheerio.load(body);
	      $(body).find('img.chapter-img').each(function(index, element) {
			  let info = ($(element).attr('src'));
			  if(info){
				list.push(info);
			  }
	      });
	    // Creating the folders for the chapter.
		// Downloading the each link
		let counter = 1;
	    list.forEach(function(item, url){
	    	let val = item.trim();
	    	// Downloadin the images.
			let file = fs.createWriteStream(mpath + '/' + "page" + counter + ".jpg");
    		let req = http.get(val, function(response) {
        		response.pipe(file)
			});
			counter = counter + 1;

		});
	});
}

module.exports = {
	download: download
}