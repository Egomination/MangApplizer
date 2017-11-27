const request = require('request'),
	  cheerio = require('cheerio'),
	  http = require('http'),
	  mkdirp = require('mkdirp-promise'),
	  fs = require('fs-extra'),
	  readline = require('readline'),
	  downloader = require('../../scripts/downloader'),
	  {dialog} = require('electron');


let list = [];
var flag = 0;
// This function will be generalized and download will be seperated.
// TODO: Fix the download and additional manga sites!

function lhs(foldername, chname){
	let mpath = './imgs/' + foldername + '/' + chname + '/';
	foldername = foldername.toLowerCase();
	foldername = foldername.replace(/ /g, "-");

	let url = 'http://lhscans.com/read-'+foldername+'-chapter-'+chname+
					'.html';
	if(!foldername && !chname){
		dialog.showMessageBox({type: "error", message: "Fill the form correctly!",
	    	buttons: ['OK'] });
	}
	else{
		// Creating the folders
		mkdirp(mpath)
			.catch(console.error);

	request(url, function(err, resp, body) {
		const $ = cheerio.load(body);
		let x = $("title").text();
		if(x == 'Lhscans - Read manga online in high quality'){
			url = 'http://lhscans.com/read-'+foldername+'-raw-chapter-'+chname+
						'.html';
			lhsDownloader(url, foldername, chname, mpath);
		}else{
			lhsDownloader(url, foldername, chname, mpath);
			}
		});	
	}
}


function lhsDownloader(url, foldername, chno, path){
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
				let file = fs.createWriteStream(path + counter + '.' + 
					val.split('.').pop(-1).toLowerCase());
					// let req = http.get(val, function(response) {
					// 	response.pipe(file)
					// 	});
					downloader(file, val);
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

module.exports = {
	lhs: lhs
}