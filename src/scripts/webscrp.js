const request = require('request'),
	  cheerio = require('cheerio'),
	  http = require('http'),
	  mkdirp = require('mkdirp-promise'),
	  fs = require('fs-extra'),
	  readline = require('readline'),
	  {dialog} = require('electron');


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
	    	// val.split('.').pop(-1).toLowerCase();
			let file = fs.createWriteStream(mpath + counter + '.' + // counter seems working but
				// after downloading, they looks unordered in sublime.
				val.split('.').pop(-1).toLowerCase()); // we need original extension.
    		let req = http.get(val, function(response) {
        		response.pipe(file)
			});
			counter = counter + 1;

		});
		// Dialog message after successful download operation.
	    dialog.showMessageBox({message: "Downloading completed successfully!",
	    	buttons: ['OK'] });

	});
}

module.exports = {
	download: download
}