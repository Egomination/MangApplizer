const request = require("request");
const cheerio = require("cheerio");
const downloader = require("../downloader");
const Database = require("../db/db");
const Logger = require("../logger/log");

class LHS {
    constructor() {
        // for now create db in ctor.
        // let db = new Database();
        // db.createDB();
        this.BASE_URL = "http://lhscans.com/";
    }

    /**
     * Opens a connection, and passes the response and body of the html.
     * @param  {String}   url Url of the manga
     * @param  {Function} callback Callback funtion that returns to the info
     * @returns {void}
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
     * @returns {void}
     */
    getAllMangaAndUpdate() {
        // all pages -> available mangas in lhs
        const dbObj = new Database();
        const value = [];
        const keys = [];
        const url = this.BASE_URL + "manga-list.html?listType=allABC";
        this.get(url, function(response, body) {
            if (response.statusCode !== 200) { return; }
            const $ = cheerio.load(body);
            $(body).find("span a").each(function(index, element) {
                const key = $(element).text();
                const val = $(element).attr("href");
                keys.push(key);
                value.push(val);
                dbObj.updateWholeDB(key, val);
            });
        });
    }

    /**
     * Updates manga information of Author, Genre(s), Status, Released Magazine, 
     * How many views it has.
     * @param {String} name Name of the Manga
     * @returns {void}
     */
    updateAdditionalInfo(name) {
        name = name + " - Raw";
        const dbObj = new Database();
        const infodump = [];
        dbObj.returnUrl(name, (error, data) => {
            if (error === 404) { console.log("Manga is not found!"); } else {
                this.get(this.BASE_URL + data, (response, body) => {
                    const $ = cheerio.load(body);
                    $(body).find(".manga-info li").each(function(indx, elem) {
                        var data = $(elem).text();
                        infodump.push(data);
                    });
                    let desc = $(body).find("div[class=row] p").text();
                    desc = desc.split("!");
                    desc = desc.pop(0);
                    infodump.push(desc);
                    dbObj.insertAdditionalInfo(name, infodump);
                });
            }
        });
    }

    /**
     * Returns to the manga information-> Author, Genre, Status Released Magazine, Description
     * @param  {String}   name     Name of the Manga
     * @param  {Function} callback Data which contains info
     * @returns {void}
     */
    getMangaInfo(name, callback) {
        name = name + " - Raw";
        const log = new Logger();
        const dbObj = new Database();
        dbObj.getInfo(name, (error, data) => {
            if (error) { log.Error(error, "Manga could not found"); } else {
                if (data.Description === null) {
                    console.log("Downloading Additional Information!");
                    name = name.split(" - Raw");
                    // TODO: make new data usable.
                    this.updateAdditionalInfo(name[0]);
                }
                log.Warning("","Testing the given error in another file");
                callback(null, data);
            }
        });
    }

    /**
     *  Finds all of the chapters of given manga's
     *  @param {String} name Name of the Manga
     *  @returns {void}
     */
    getChapters(name) {
        const dbObj = new Database();
        name = name + " - Raw";
        dbObj.returnUrl(name, (error, data) => {
            this.get(this.BASE_URL + data, (response, body) => {
                if (response.statusCode !== 200) { return; }
                const $ = cheerio.load(body);
                $(body).find("td a b").each(function(index, element) {
                    const data = $(element).text();
                    // Will Probably Change After UI implementation.
                    console.log(data);
                });
            });
        });
    }

    /**
     * Finds the page links of the looked chapter.
     * @param {String} url The name of the manga. G Men *Case sensitive
     * @param {String} chNo Chapter Number
     * @returns {void}
     */
    getPages(url, chNo) {
        const dbObj = new Database();
        const log = new Logger();
        url = url + " - Raw";
        const pageUrls = [];
        dbObj.returnUrl(url, (error, data) => {
            let pageUrl = data;
            pageUrl = pageUrl.replace("manga", "read");
            pageUrl = pageUrl.replace(".html", `-chapter-${chNo}.html`);
            this.get(this.BASE_URL + pageUrl, (response, body) => {
                if (response.statusCode !== 200) { console.log("err"); }
                const $ = cheerio.load(body);
                $(body).find(".chapter-content .chapter-img").each(function(index, element) {
                    let value = $(element).attr("src");
                    // Dunno why but, it prints 3 undefineds.
                    value = (!value) ? null : value;
                    pageUrls.push(value);
                });
                downloader(pageUrls, url, chNo);
                log.logRun(LHS.name, url, chNo);
            });
        });
    }
}

const obj = new LHS();
// // obj.getAllMangaAndUpdate();
obj.getMangaInfo("Barakamon", (error, data) => {
    console.log(data);
});
// obj.updateAdditionalInfo("Shokugeki no Souma");
// obj.getChapters("G Men");
// obj.getPages("G Men", 150);
// obj.getMangaInfo("G Men", (error, data) => {
//     console.log(data);
// });