const hakuneko = require('hakuneko');

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

            // Returns to the given chapter no.
            let chapterNo = chapters.filter(function(obj) {
                // Kissmanga puts double 0 in front of the all 1 digit chapters.
                // But puts one 0 in front of 2 digit chapters.
                let chapterNoFromTitle = obj.t.match(/\d+(\.\d+)?/);
                if (chno > 0 && chno < 10) {
                    return chapterNoFromTitle[0] == '0' + '0' + chno;
                } else if (chno >= 10 && chno < 100) {
                    return chapterNoFromTitle[0] == '0' + chno;
                } else {
                    return chapterNoFromTitle[0] == chno;
                }
            });
            if (typeof chapterNo[0] === 'undefined') {
                Materialize.toast(`Chapter ${chno} is not available
                    for ${nmanga}`, 5000);
                return;
            }

            // Handling the chapter no input greater than number of chaps.
            if (chapterNo > chapters.length || chapterNo < 0) {
                chapter = chapters[0];
            } else {
                chapter = chapterNo[0]; // bc chapterNo is also an array.
            }

            // Generating chapter no from its title. Since some of the mangas
            // do not have number in api.
            let chapterNoForPath = chapter.t.match(/\d+(\.\d+)?/);

            // Creating the chapter name with actual ch number
            let path = './imgs/' + nmanga + '/' + chapterNoForPath[0] + '/';

            mkdirp(path)
                .catch(console.error);

            hakuneko.kissmanga.getPages(chapter, function(error, pages) {
                if (!error) {
                    chapter.p = pages; // Will be usefull later.

                    pages.forEach(function(item) {
                        item = item.trim();
                        item = item.match(/(.*\.jpe?g|.*\.png)/);

                        // Downloading from Https, doesnt work
                        // So i had to convert it to http
                        let link = item[0].split('://');
                        let newLink = "http://" + link[1];

                        console.log(newLink.match(/\d*.png|\d*.jpe?g/));
                        let file = fs.createWriteStream(path + "000" +
                            newLink.match(/\d+\w\d*.png|\d+\w\d*.jpe?g/));

                        let downloader = http.get(newLink, function(response) {
                            response.pipe(file)
                        });
                    });
                    Materialize.toast('Downloading completed' +
                        ' successfully!', 5000);
                } else {

                    console.log(error);
                }
            });
        } else {
            console.log(error);
            Materialize.toast(`${nmanga} is not found in Kissmanga`, 5000);
        }
    });
}