const request = require("request");
const cheerio = require("cheerio");
const jso = require("../jsoner");
const fs = require("fs");

class LHS {
    constructor(title) {
        this.title = title;
        this.existingChapters = [];
        this.existingManga = {};
        this.BASE_URL = "http://lhscans.com/";
    }

    get(url, callback) {
        request(url, function(error, response, body) {
            callback(response, body);
        });
    }

    /**
     *
     */
    getAllManga(url) {
        // all pages -> available mangas in lhs
        let value = [];
        let keys = [];
        url = this.BASE_URL + "manga-list.html?listType=allABC";
        this.get(url, function(response, body) {
            if (response.statusCode !== 200) return;
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

    getAvailableManga(callback) {
        fs.readFile("db.json", (error, data) => {
            if (error) throw error;
            let value = JSON.parse(data);
            // console.log(value);
            callback(null, value);
        });
    }

    getChapters(name) {
        name = name + " - Raw";
        let mangaUrl;
        this.getAvailableManga((error, data) => {
            mangaUrl = data[name];
            console.log(mangaUrl);
        });
    }
}

let obj = new LHS('test');
// obj.getAllManga("http://lhscans.com/");
obj.getChapters("A Un");
// manga name : a-un