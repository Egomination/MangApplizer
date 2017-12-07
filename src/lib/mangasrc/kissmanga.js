const hakuneko = require('hakuneko'),
    fs = require('fs-extra');

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
    // FIXME:foldername = foldername.toLowerCase() foldername = foldername.replace(/ /g, "-");
    let nmanga = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;
    nmanga = nmanga.replace(/ /g, "-");

    manga = hakuneko.base.createManga('Title', `/Manga/${nmanga}`);
    hakuneko.kissmanga.getChapters(manga, function(error, chapters) {
        if (!error) {

            chapter = hakuneko.base.createChapter('[VOL]', '[NR]', 'Title',
                'lang', 'scanlator', `/Manga/${nmanga}`, []);
            // FIXME: 0 -> equals the last chap
            chapter = chapters[chno];
            console.log(chapter);

            hakuneko.kissmanga.getPages(chapter, function(error, pages) {
                if (!error) {
                    let regex = new RegExp(/.*\.jpe?g|.*\.png/);
                    pages.forEach(function(item){
                        let x = item.match(regex);
                        x.trim();
                        let file = fs.createWriteStream('./imgs/' +
                            x.split('/').pop(-1).toLowerCase());
                        let req = http.get(x, function(response) {
                            response.pipe(file)});
                 });
                    chapter.p = pages; // assign pages to chapter
                }
            });
                // console.log(error, pages)
        } else {
            // console.log(error);
        }

    });
}