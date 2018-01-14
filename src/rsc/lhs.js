const request = require("request");
const cheerio = require("cheerio");
const jso = require("../jsoner");
const downloader = require("../downloader");
const fs = require("fs");

class LHS {
    constructor(title) {
        this.title = title;
        this.existingChapters = [];
        this.existingManga = [];
        this.BASE_URL = "http://lhscans.com/";
    }

    /**
     * Opens a connection, and passes the response and body of the html.
     * @param  String   url
     * @param  Function callback
     */
    get(url, callback) {
        request(url, function(error, response, body) {
            callback(response, body);
        });
    }

    /**
     * Creates the db.json with all available mangas in LHScans.com
     */
    getAllManga() {
        // all pages -> available mangas in lhs
        let value = [];
        let keys = [];
        let url = this.BASE_URL + "manga-list.html?listType=allABC";
        this.get(url, function(response, body) {
            if (response.statusCode !== 200) { return; }
            const $ = cheerio.load(body);
            let info = $(body).find("span a").each(function(index, element) {
                let key = $(element).text();
                let val = $(element).attr("href");
                keys.push(key);
                value.push(val);
            });
            jso(keys, value);
        });
    }

    /**
     *  It's for reading values from the database.
     *  Passes them into the caller function.
     *  @param Function callback
     */
    getAvailableManga(callback) {
        fs.readFile("db.json", (error, data) => {
            if (error) { throw error; }
            let value = JSON.parse(data);
            // console.log(value);
            callback(null, value);
        });
    }

    /**
     * Finds manga information such as, Genre(s), Author(s)
     * Can be used as an utility for Search method.
     * @param String name
     */
    getMangaInfo(name /*, callback*/ ) {
        name = name + " - Raw";
        let mangaUrl;
        let infodump = [];
        this.getAvailableManga((error, data) => {
            mangaUrl = data[name]["url"][0];
            this.get(this.BASE_URL + mangaUrl, (response, body) => {
                const $ = cheerio.load(body);
                let i = 0;
                let info = $(body).find(".manga-info li").each(function(indx, elem) {
                    var data = $(elem).text();
                    infodump[i] = data;
                    i += 1;
                });
                let desc = $(body).find("div[class=row] p").text();
                desc = desc.split("!");
                desc = desc.pop(0);
                // callback(null, infodump);
                console.log(infodump);
                console.log(desc);
            });
        });
    }

    /**
     *  Finds all of the chapters of given manga's
     *  @param String name
     */
    getChapters(name) {
        name = name + " - Raw";
        let mangaUrl;
        this.getAvailableManga((error, data) => {
            mangaUrl = data[name]["url"][0];
            this.get(this.BASE_URL + mangaUrl, (response, body) => {
                if (response.statusCode !== 200) { return; }
                const $ = cheerio.load(body);
                let info = $(body).find("td a b").each(function(index, element) {
                    let data = $(element).text();
                    // Will Probably Change After UI implementation.
                    console.log(data);
                });
            });
        });
    }

    /**
     * Finds the page links of the looked chapter.
     * @param String name The name of the manga. G Men *Case sensitive
     * @param String chNo
     */
    getPages(url, chNo) {
        url = url + " - Raw";
        let pageUrls = [];
        this.getAvailableManga((error, data) => {
            let pageUrl = data[url]["url"][0];
            pageUrl = pageUrl.replace("manga", "read");
            pageUrl = pageUrl.replace(".html", `-chapter-${chNo}.html`);
            this.get(this.BASE_URL + pageUrl, (response, body) => {
                if (response.statusCode !== 200) { console.log('err'); }
                const $ = cheerio.load(body);
                let info = $(body).find(".chapter-content .chapter-img").each(function(index, element) {
                    let value = $(element).attr("src");
                    // Dunno why but, it prints 3 undefineds.
                    value = (!value) ? null : value;
                    pageUrls.push(value);
                });
                let path = downloader.createFolders(url, chNo);
                // Removing Null values.
                pageUrls = pageUrls.filter((i) => i);
                pageUrls.forEach(function(item) {
                    let pUrl = item.trim();
                    // Waiting folder creation.
                    setTimeout(function() {
                        downloader.downloader(pUrl, path);
                    }, 2000);
                });
            });
        });
    }
}

let obj = new LHS("test");
// obj.getAllManga();
obj.getChapters("G Men");
obj.getPages("G Men", 150);
// manga name : a-un