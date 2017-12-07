const request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    mkdirp = require('mkdirp-promise'),
    fs = require('fs-extra'),
    { dialog } = require('electron');



//NOTE: Will be moved into lhs!
let list = []
//http://lhscans.com/read-rakudai-kishi-no-eiyuutan-raw-chapter-45.html

function lhs() {
    let foldername = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;
    let url = foldername;
    // NOTE: This generates folder name from the given url
    // Untill i found a good solution for search by name
    // Thiss will be used for downloading.
    foldername = foldername.split('/').pop(-1).toLowerCase();
    foldername = foldername.split('-');
    foldername = foldername[1] + foldername [2];
    console.log(foldername);

    let mpath = './imgs/' + foldername + '/' + chno + '/';
    foldername = foldername.toLowerCase()
    foldername = foldername.replace(/ /g, "-");


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
    });
}



function lhsDownloader(url, foldername, chno, path) {

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

            let counter = 1;
            list.forEach(function(item, url) {
                let imgUrl = item.trim();
                // Downloadin the images.
                let file = fs.createWriteStream(path + counter + '.' +
                    imgUrl.split('.').pop(-1).toLowerCase());
                let req = http.get(imgUrl, function(response) {
                    response.pipe(file)
                });
                counter = counter + 1;
            });
            // Dialog message after successful download operation.
            dialog.showMessageBox({
                message: "Downloading completed successfully!",
                buttons: ['OK']
            });
        }
    });
}

module.exports = {
    lhs: lhs
}