const request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    mkdirp = require('mkdirp-promise'),
    fs = require('fs-extra'),
    { dialog } = require('electron').remote;

// Fetch API
require('es6-promise').polyfill();
require('isomorphic-fetch');



let list = []

function lhs() {
    // Getting form inputs.
    let foldername = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;

    let mpath = './imgs/' + foldername + '/' + chno + '/';
    foldername = foldername.toLowerCase()
    foldername = foldername.replace(/ /g, "-");

    let url = 'http://lhscans.com/read-' +
        foldername + '-chapter-' + chno + '.html';

    fetch(url, { redirect: "manual" }).then(function(response) {
        // Means there is a redirect on website.
        // FIXME: If there's no chapter, website still redirects
        // and because of below if clause, it downloads random chapter
        // somehow!
        if (response.status === 0) {
            url = 'http://lhscans.com/read-' +
                foldername + '-raw-chapter-' + chno + '.html';
            if (response.status === 0) {
                // NOTE: Need to find a way to get available chapters
                // for lhscans
                console.log("Another Redirect Spoted!");
                return -1;
            }
        }
        request(url, function(error, response, body) {
            if (response.statusCode == 200 && !error) {
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
            // Traversing through the images on the array.
            list.forEach(function(item, url) {
                let imgUrl = item.trim();
                // Creating file name for the image.
                let file = fs.createWriteStream(path +
                    imgUrl.split('/').pop(-1).toLowerCase());
                let req = http.get(imgUrl, function(response) {
                    response.pipe(file)
                });
            });
            // Dialog message after successful download operation.
            Materialize.toast('Downloading completed successfully!', 5000);
        } else {
            console.log(error);
        }
    });
}

// EDIT: Find a way to implement this into download!
function getAvailableChapters(url) {

    let chapterList = []
    // NOTE: need to parse the url 'till -chapter-...
    let regex = new RegExp(/(.*)(?:-chapter)/);
    // mangaPage returns to the given manga's manga page.
    let mangaPage = url.match(regex);
    mangaPage = mangaPage[1] + '.html';
    mangaPage = mangaPage.replace("read", "manga");

    // Need to find latest chapter!
    request(mangaPage, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // First we get the image urls from lhscans.
            const $ = cheerio.load(body);
            $(body).find('a.chapter').each(function(index, element) {
                let info = ($(element).attr('href'));
                if (info) {
                    chapterList.push(info);
                }
            });
            // Find a way to return this value
            // Possible solutions -> Callback, Promise
            return chapterList[0];
        }
    });
    console.log(chapterList);
}


module.exports = {
    lhs: lhs
}