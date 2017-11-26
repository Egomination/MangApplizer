const request = require('request'),
	  cheerio = require('cheerio'),
	  http = require('http'),
	  mkdirp = require('mkdirp-promise'),
	  fs = require('fs-extra'),
	  readline = require('readline'),
	  {dialog} = require('electron');


let list = [];
// This function will be generalized and download will be seperated.
// TODO: Fix the download and additional manga sites!
function download(url, foldername, chname){
	let mpath = './imgs/' + foldername + '/' + chname + '/';

	if(!url && !foldername && !chname){
		dialog.showMessageBox({type: "error", message: "Fill the form correctly!",
	    	buttons: ['OK'] });
	}
	else{
		// Creating the folders
		mkdirp(mpath)
			.catch(console.error);
		request(url, function(err, resp, body) {
			if(!err && resp.statusCode == 200){
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
				let file = fs.createWriteStream(mpath + counter + '.' + 
					val.split('.').pop(-1).toLowerCase());
	    		let req = http.get(val, function(response) {
	        		response.pipe(file)
				});
				counter = counter + 1;

			});
			// Dialog message after successful download operation.
		    dialog.showMessageBox({message: "Downloading completed successfully!",
		    	buttons: ['OK'] });
			}else{
				dialog.showMessageBox({type: 'error', 
					message: "Check your internet connection given URL adress!",
		    		buttons: ['OK'] });
			}
		});
	}
}

module.exports = {
	download: download
}