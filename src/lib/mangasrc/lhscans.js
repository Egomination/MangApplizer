const request = require('request'),
	  cheerio = require('cheerio'),
	  http = require('http'),
	  mkdirp = require('mkdirp-promise'),
	  fs = require('fs-extra'),
	  {dialog} = require('electron');



//NOTE: Will be moved into lhs!
let list = []


function lhs(){
	let foldername = document.getElementById('fname').value;
	let chno = document.getElementById('chno').value;
	
	let mpath = './imgs/' + foldername + '/' + chno + '/';
	foldername = foldername.toLowerCase();
	foldername = foldername.replace(/ /g, "-");

	let url = 'http://lhscans.com/read-'+foldername+
                '-chapter-'+chno+'.html';
	
            let urlChecker = request(url, function(error, response, body){return true;})
            //FIXME: I'm not sure that if its doing the trick for us
            if(urlChecker == '/index.js'){
            url = 'http://lhscans.com/read-'+foldername+'-raw-chapter-'+chno+
                '.html';
            }
            console.log(url); 
		request(url, function(err, response, body) {
			if(response.statusCode == 200){
				// Creating the folders
				mkdirp(mpath)
					.catch(console.error);
				
				  const $ = cheerio.load(body);
			      $(body).find('img.chapter-img').each(function(index, element) {
					  let info = ($(element).attr('src'));
					  if(info){
						list.push(info);
					  }
			      });
			      lhsDownloader(url, foldername, chno, mpath);
			}else{
				console.log(error);
			}
		});	
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
		
		let counter = 1;
		list.forEach(function(item, url){
			let imgUrl = item.trim();
			// Downloadin the images.
			let file = fs.createWriteStream(path + counter + '.' + 
				imgUrl.split('.').pop(-1).toLowerCase());
			let req = http.get(imgUrl, function(response) {
				response.pipe(file)
			});
			counter = counter + 1;
		});
		/*
		// Dialog message after successful download operation.
	    dialog.showMessageBox({message: "Downloading completed successfully!",
	    	buttons: ['OK'] });*/
		}
	});
}

module.exports = {
	lhs: lhs
}
