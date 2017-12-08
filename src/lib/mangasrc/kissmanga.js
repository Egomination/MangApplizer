const hakuneko = require('hakuneko'),
    https = require('https');

/*
	regex=(.*\.jpe?g|.*\.png)
	its for the handling urls correction

 */
/*
function test(){
    let a = document.getElementById('fname');
    let text = a.value;
    console.log(text);
    get_pages(text);
}*/


function buttoKun() {
    // TODO: nmanga -> REGEX INCOMING!!!!!
    // TODO: Add a path for download. Also don't redefine the requiremens on lhscans
    // these are still valid on this page. bkz: fs.createWriteStream
    let nmanga = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;

    manga = hakuneko.base.createManga('Title', `/Manga/${nmanga}`);
    hakuneko.kissmanga.getChapters(manga, function(error, chapters) {
        if (!error) {

            chapter = hakuneko.base.createChapter('[VOL]', '[NR]', 'Title',
                'lang', 'scanlator', `/Manga/${nmanga}`, []);
            chapterNo = (chapters.length - chno) - 1; // Because of array
            console.log(chapterNo);
            chapter = chapters[chapterNo];
            console.log(chapter);
            hakuneko.kissmanga.getPages(chapter, function(error, pages) {
                if (!error) {
                    pages.forEach(function(item){
                        item = item.trim();
                        let regex = new RegExp(/(.*\.jpe?g|.*\.png)/)
                        item = item.match(regex); // FIXME: regex returns to array.

                        // Downloading from Https, doesnt work
                        // So i had to convert it to http
                        let link = item[0].split('://');
                        let newLink = "http://"+link[1];
                        
                        let file = fs.createWriteStream('./imgs/' +
                            newLink.split('-').pop(-1));
                        let req = http.get(newLink, function(response) {
                            response.pipe(file)
                        });
                    });
                    // chapter.p = pages; // assign pages to chapter
                }
                // console.log(error, pages)
            });
        } else {
            console.log(error);
        }

    });
}