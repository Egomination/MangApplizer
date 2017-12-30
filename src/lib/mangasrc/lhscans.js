const request = require("request"),
    cheerio = require("cheerio");

// Fetch API
require("es6-promise").polyfill();
require("isomorphic-fetch");



let list = []

// Takes body from the request.
function parsePage(body) {
    const $ = cheerio.load(body);
    $(body).find("img.chapter-img").each(function(index, element) {
        let info = ($(element).attr("src"));
        if (info) {
            list.push(info);
        }
    });
}


function lhsDownloader(url, path) {
    request(url, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            // First we get the image urls from lhscans.
            parsePage(body);
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
            Materialize.toast("Downloading completed successfully!", 5000);
            list = []; // Freeing the list after every chapter download !
        } else {
            console.log(error);
        }
        resp.socket.end();
    });
}


// Return to the available chapters. If not, sends pop up msg.
function getAvailableChapters(url, foldername, callback) {
    let chapterList = []
    // mangaPage returns to the given manga's manga page.
    let mangaPage = url.match(/(.*)(?:-chapter)/);
    mangaPage = mangaPage[1] + ".html";
    mangaPage = mangaPage.replace("read", "manga");

    fetch(mangaPage, { redirect: "manual" }).then(function(response) {
        if (response.status === 0) {
            mangaPage = mangaPage.replace("-raw", "");
            //(╯°□°）╯︵ ┻━┻
            fetch(mangaPage, { redirect: "manual" }).then(function(response) {
                if (response.status === 0) {
                    // manga not found!
                    Materialize.toast(`'${foldername}' is not available!`,
                        5000);
                } else {
                    //(╯°□°）╯︵ ┻━┻
                    request(mangaPage, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            // First we get the image urls from lhscans.
                            const $ = cheerio.load(body);
                            $(body).find("a.chapter")
                                .each(function(index, element) {
                                    let info = ($(element).attr("href"));
                                    if (info) {
                                        //(╯°□°）╯︵ ┻━┻
                                        chapterList.push(info);
                                    }
                                });
                            url = chapterList; // We can pass all of the array
                            callback && callback(null, url);
                        }
                    });
                }
            });
        } else {
            // Need to find latest chapter!
            request(mangaPage, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    // First we get the image urls from lhscans.
                    const $ = cheerio.load(body);
                    $(body).find("a.chapter").each(function(index, element) {
                        let info = ($(element).attr("href"));
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

// Main function for the getting manga pages!
function getChapters(url, mpath) {
    request(url, function(error, response, body) {
        if (response.statusCode == 200 && !error) {
            // Creating the folders
            mkdirp(mpath)
                .catch(console.error);

            parsePage(body);
            lhsDownloader(url, mpath);
        } else {
            console.log(error);
        }
        response.socket.end();
    });
}


function lhs() {
    // Getting form inputs.
    let foldername = document.getElementById("fname").value;
    let chno = document.getElementById("chno").value;

    foldername = foldername.toLowerCase()
    foldername = foldername.replace(/ /g, "-");
    let mpath = "./imgs/" + foldername + "/" + chno + "/";

    let url = "http://lhscans.com/read-" +
        foldername + "-chapter-" + chno + ".html";

    fetch(url, { redirect: "manual" }).then(function(response) {
        if (response.status === 0) {
            url = "http://lhscans.com/read-" +
                foldername + "-raw-chapter-" + chno + ".html";

            fetch(url, { redirect: "manual" }).then(function(response) {
                if (response.status === 0) {
                    let pages = getAvailableChapters(url, foldername,
                        function(error, pages) {
                            // finding chapter no.
                            let reg = new RegExp(/(.*)(:?-)(.*)(:?.html)/);
                            let newChNo = pages[0].match(reg);
                            console.log(newChNo);
                            // Generating new path for last chapter!
                            mpath = "./imgs/" + foldername + "/" +
                                newChNo[3] + "/"
                            url = "http://lhscans.com/" + pages[0];
                            getChapters(url, mpath);
                        });
                } else {
                    getChapters(url, mpath);
                }
            });
        } else {
            // Link is correct!
            getChapters(url, mpath);
        }
    });
}
