const request = require('request'),
    cheerio = require('cheerio');

// Fetch API
require('es6-promise').polyfill();
require('isomorphic-fetch');



let list = []

function lhs() {
    // Getting form inputs.
    let foldername = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;

    foldername = foldername.toLowerCase()
    foldername = foldername.replace(/ /g, "-");
    let mpath = './imgs/' + foldername + '/' + chno + '/';

    let url = 'http://lhscans.com/read-' +
        foldername + '-chapter-' + chno + '.html';

    fetch(url, { redirect: "manual" }).then(function(response) {
        if (response.status === 0) {
            if (response.status === 0) {
                console.log("Another Redirect Spoted!");

                let pages = GetAvailableChapters(url, foldername, function(error, pages) {
                    // finding chapter no.
                    let reg = new RegExp(/(.*)(:?-)(.*)(:?.html)/);
                    let newChNo = pages[0].match(reg);

                    // Generating new path for last chapter!
                    mpath = './imgs/' + foldername + '/' + newChNo[3] + '/'
                    url = 'http://lhscans.com/' + pages[0];
                    GetChapters(url, mpath);
                });
            } else {
                url = 'http://lhscans.com/read-' +
                    foldername + '-raw-chapter-' + chno + '.html';
                GetChapters(url, mpath);
            }
        } else {
            // Link is correct!
            GetChapters(url, mpath);
        }

    });
}

// Main function for the getting manga pages!
function GetChapters(url, mpath) {
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
            lhsDownloader(url, mpath);
        } else {
            console.log(error);
        }
    });
}

function lhsDownloader(url, path) {
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
                let downloader = http.get(imgUrl, function(response) {
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


function GetAvailableChapters(url, foldername, callback) {
    let chapterList = []
    let regex = new RegExp(/(.*)(?:-chapter)/);
    // mangaPage returns to the given manga's manga page.
    let mangaPage = url.match(regex);
    mangaPage = mangaPage[1] + '.html';
    mangaPage = mangaPage.replace("read", "manga");

    fetch(url, { redirect: "manual" }).then(function(response) {
        if (response.status === 0) {
            // That means manga is not found
            Materialize.toast(`'${foldername}' is not available!`, 5000);
        } else {
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
                    url = chapterList; // We can pass all of the array
                    callback && callback(null, url);
                }
            });
        }
    });
}