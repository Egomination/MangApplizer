const http = require('http');

function downloader(file, url){
	let req = http.get(url, function(response) {
	response.pipe(file)
	});
}

module.exports = downloader;
// module.exports = {
// 	downloader: downloader
// }