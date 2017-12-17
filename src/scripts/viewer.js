// Viewer window scripts

const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
let path;

// Needed for Materialize Design
$(document).ready(function() {
    $('select').material_select();
    $('.carousel.carousel-slider').carousel({ fullWidth: true });
});

// Opening event of viewer window
ipcRenderer.on('open-viewer-reply', (event, mangaPath) => {
    path = mangaPath;
    // NOTE: Add this to the html file
    $("#chapterlist")
        .append('<option value="nul" disabled selected>Please select a chapter</option>');
    // Folder listing for viewer window
    fs.readdirSync(mangaPath).forEach(file => {
        $("#chapterlist").append(
            $("<option>").attr("value", `${file}`).append(`${file}`)
        );
    });
});

// Will list pages of said manga + IPC event to reload page
function viewManga() {
    let chapter = $("#chapterlist option:selected").val();
    let chapPath = path + chapter;
    ipcRenderer.send('open-chapter', chapPath);
}


// Ipc event that gives the path from main-viewer
ipcRenderer.on('open-chap-reply', (event, chapPath) => {
    console.log("chapPath2:" + chapPath);
    $("#chapView").empty();
    fs.readdirSync(chapPath) /*.filter(function(file) { return file.substr(-4) === '.jpg'; })*/
        .forEach(file => {
            $("#chapView").append(
                $("<a>").attr("class", "carousel-item").append(
                    $("<img>").attr("src", "../." + chapPath + "/" + file)
                )
            );
        });

});