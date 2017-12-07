const request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    mkdirp = require('mkdirp-promise'),
    fs = require('fs-extra'),
    { dialog } = require('electron').remote;



//NOTE: Will be moved into lhs!
let list = []

function lhs() {

<<<<<<< HEAD
function lhs(){
	let foldername = document.getElementById('fname').value;
	let chno = document.getElementById('chno').value;
	
	let mpath = './imgs/' + foldername + '/' + chno + '/';
	foldername = foldername.toLowerCase();
	foldername = foldername.replace(/ /g, "-");
=======
    let foldername = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;
>>>>>>> 858088ac0100427c881aca793a0f3bd0053f77fe

    let mpath = './imgs/' + foldername + '/' + chno + '/';
    foldername = foldername.toLowerCase()
    foldername = foldername.replace(/ /g, "-");

    let url = 'http://lhscans.com/read-' +
        foldername + '-chapter-' + chno + '.html';
    console.log(url);
    request(url, function(error, response, body) {
        console.log(response.req.path);
        if (response.req.path == '/index.html') {
            url = 'http://lhscans.com/read-' +
                foldername + '-raw-chapter-' + chno + '.html';
        }
        console.log(url);
        request(url, function(err, resp, body) {
            if (resp.statusCode == 200) {
                // Creating the folders
                mkdirp(mpath)
                    .catch(console.error);

                const $ = cheerio.load(body);
                $(body).find('img.chapter-img').each(function(index, element) {
                    let info = ($(element).attr('src'));
                    if (info) {
                        list.push(info);
                    }
                });
                lhsDownloader(url, foldername, chno, mpath);
            } else {
                console.log(error);
            }
<<<<<<< HEAD
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
=======
        });
    });
>>>>>>> 858088ac0100427c881aca793a0f3bd0053f77fe
}


function lhsDownloader(url, foldername, chno, path) {

<<<<<<< HEAD
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
=======
    request(url, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            // First we get the image urls from lhscans.
            const $ = cheerio.load(body);
            $(body).find('img.chapter-img').each(function(index, element) {
                let info = ($(element).attr('src'));
                if (info) {
                    list.push(info);
                }
            });

            list.forEach(function(item, url) {
                let imgUrl = item.trim();
                // Downloadin the images.
                let file = fs.createWriteStream(path +
                    imgUrl.split('/').pop(-1).toLowerCase());
                let req = http.get(imgUrl, function(response) {
                    response.pipe(file)
                });
            });
            // Dialog message after successful download operation.
            dialog.showMessageBox({
                message: "Downloading completed successfully!",
                buttons: ['OK']
            });
        }
    });
>>>>>>> 858088ac0100427c881aca793a0f3bd0053f77fe
}

module.exports = {
    lhs: lhs
}