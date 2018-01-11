const request = require("request");
const cheerio = require("cheerio");
const jso = require("../jsoner");
const fs = require("fs");

class LHS{
	constructor(title){
		this.title = title;
		this.existingChapters = [];
		this.existingManga = [];
		this.BASE_URL = "http://lhscans.com/";
	}

	get(url, callback){
		request(url, function(error, response, body){
			callback(response, body);
		});
	}

	/**
	 * 
	 */
	getAllManga(url){
		// all pages -> available mangas in lhs
		let test = [];
		url = this.BASE_URL + "manga-list.html?listType=allABC";
		this.get(url, function(response, body){
			if(response.statusCode !== 200) return;
			const $ = cheerio.load(body);
			let info = $(body).find("span a").each(function(index, element){
				let data = $(element).attr("href");
				test.push(data);
			});
			jso("lhsmanga", test);
		});
	}



let obj = new LHS('test');
// obj.getAllManga("http://lhscans.com/");
obj.test();