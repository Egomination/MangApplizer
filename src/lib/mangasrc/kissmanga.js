const hakuneko = require('hakuneko');

/*
	regex=(.*\.jpe?g|.*\.png)
	its for the handling urls correction

 */

function buttoKun(){
	manga = hakuneko.base.createManga( 'Title', '/Manga/Bleach' );
	hakuneko.kissmanga.getChapters( manga, function( error, chapters ){
		if(!error){

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
}

// Grey out the button if at least one input is missing
(function(){
    $("form input").on("keyup change",function() {

        let empty = false;
        $('form input').each(function() {
			// Check is any input value is empty
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if(empty){
            $('#butto-kun').attr('disabled', 'disabled'); 
		} 
		else{
            $('#butto-kun').removeAttr('disabled');
        }
    });
})()