const request = require("request");
const cheerio = require("cheerio");
const downloader = require("../downloader");
const Database = require("../db");
const fs = require("fs");

class LHS {
    constructor(title) {
        // for now create db in ctor.
        // let db = new Database();
        // db.createDB();
        this.title = title;
        this.existingChapters = [];
        this.existingManga = [];
        this.BASE_URL = "http://lhscans.com/";
    }

    /**
     * Opens a connection, and passes the response and body of the html.
     * @param  {String}   url
     * @param  {Function} callback
     */
    get(url, callback) {
        request(url, function(error, response, body) {
                // if error.code == "ENOTFOUND" then no internet connection available
            callback(response, body);
        });
    }

    /**
     * Generates the database. If database already present, checks if there is
     * any updates on web-sites database. If there is, updates local db.
     */
    getAllMangaAndUpdate() {
        // all pages -> available mangas in lhs
        let dbObj = new Database();
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
                dbObj.updateWholeDB(key, val);
            });
        });
    }

    /**
     * Finds manga information such as, Genre(s), Author(s)
     * Can be used as an utility for Search method.
     * @param {String} name
     */
    getMangaInfo(name /*, callback*/ ) {
        name = name + " - Raw";
        let dbObj = new Database();
        let infodump = [];
        dbObj.returnUrl(name, (error, data) => {
            console.log(data);
            this.get(this.BASE_URL + data, (response, body) => {
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
                // infodump.push(desc); FIXME: REFACTOR!
                dbObj.getInfo(name, infodump, desc, (error, data) => {
                    if (error === 401) {
                        dbObj.insertAdditionalInfo(name, infodump, desc);
                    } else {
                        console.log(data);
                    }
                });
            });
        });
    }

    /**
     *  Finds all of the chapters of given manga's
     *  @param {String} name
     */
    getChapters(name) {
        let dbObj = new Database();
        name = name + " - Raw";
        dbObj.returnUrl(name, (error, data) => {
            this.get(this.BASE_URL + data, (response, body) => {
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
     * @param {String} name The name of the manga. G Men *Case sensitive
     * @param {String} chNo
     */
    getPages(url, chNo) {
        let dbObj = new Database()
        url = url + " - Raw";
        let pageUrls = [];
        dbObj.returnUrl(url, (error, data) => {
            let pageUrl = data;
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
                downloader(pageUrls, url, chNo);
            });
        });
    }
}

let obj = new LHS("test");
// obj.getAllManga();
// obj.getChapters("G Men");
// obj.getPages("G Men", 150);
obj.getMangaInfo("Archimedes no Taisen");
// obj.updateDB();
// manga name : a-un