const hakuneko = require('hakuneko');

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


    manga = hakuneko.base.createManga( 'Title', '/Manga/Bleach' );
    hakuneko.kissmanga.getChapters( manga, function( error, chapters ) {
    if( !error ) {

        chapter = hakuneko.base.createChapter('[VOL]', '[NR]', 'Title', 'lang', 'scanlator',
            '/Manga/Bleach', []);
        // do something with the chapters ...
        chapter = chapters[0];
        console.log(chapter);

        hakuneko.kissmanga.getPages( chapter, function( error, pages ){
            if( !error ) {
                chapter.p = pages; // assign pages to chapter
            }
            console.log(error, pages)
        });
    }
    });


