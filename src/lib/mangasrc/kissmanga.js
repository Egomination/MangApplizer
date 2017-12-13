const hakuneko = require('hakuneko'),
    https = require('https');


function buttoKun() {
    // Getting form informations.
    let nmanga = document.getElementById('fname').value;
    let chno = document.getElementById('chno').value;

    // Fixing the spaces
    nmanga = nmanga.toLowerCase()
    nmanga = nmanga.replace(/ /g, "-");

    manga = hakuneko.base.createManga('Title', `/Manga/${nmanga}`);
    hakuneko.kissmanga.getChapters(manga, function(error, chapters) {
        if (!error) {

            chapter = hakuneko.base.createChapter('[VOL]', '[NR]', 'Title',
                'lang', 'scanlator', `/Manga/${nmanga}`, []);
            chapterNo = (chapters.length - chno) - 1; // Because of array

            // Handling the chapter no input greater than number of chaps.
            if (chapterNo > chapters.length || chapterNo < 0) {
                chapter = chapters[0];
            } else {
                chapter = chapters[chapterNo];
            }
            // Creating the chapter name with actual ch number + title if exists.
            let path = './imgs/' + nmanga + '/' + chapter.t + '/';

            mkdirp(path)
                .catch(console.error);

            hakuneko.kissmanga.getPages(chapter, function(error, pages) {
                if (!error) {
                    let ctr = 1;
                    chapter.p = pages; // Will be usefull later.

                    pages.forEach(function(item) {
                        item = item.trim();
                        let regex = new RegExp(/(.*\.jpe?g|.*\.png)/)
                        item = item.match(regex);

                        // Downloading from Https, doesnt work
                        // So i had to convert it to http
                        let link = item[0].split('://');
                        let newLink = "http://" + link[1];
                        let file = fs.createWriteStream(path + ctr + '.' +
                            newLink.split('.').pop(-1));

                        ctr = ctr + 1;
                        let req = http.get(newLink, function(response) {
                            response.pipe(file)
                        });
                    });
                    Materialize.toast('Downloading completed successfully!', 5000);
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log(error);
        }
    });
}