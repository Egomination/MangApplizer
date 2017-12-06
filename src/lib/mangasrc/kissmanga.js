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


function buttoKun(){
    // TODO: nmanga -> REGEX INCOMING!!!!!
    let nmanga = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;

	manga = hakuneko.base.createManga( 'Title', `/Manga/${nmanga}` );
	hakuneko.kissmanga.getChapters( manga, function( error, chapters ) {
		if( !error ) {

			chapter = hakuneko.base.createChapter('[VOL]', '[NR]', 'Title', 'lang', 'scanlator',
				'/Manga/Bleach', []);
			// FIXME: 0 -> equals the last chap
			chapter = chapters[chno];
			console.log(chapter);

			hakuneko.kissmanga.getPages( chapter, function( error, pages ){
				if( !error ) {
					chapter.p = pages; // assign pages to chapter
				}
				console.log(error, pages)
			});
		}else{
            console.log(error);
        }

	});
}

