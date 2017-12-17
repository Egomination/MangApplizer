// Viewer window scripts

const {ipcRenderer} = require('electron');
const fs = require('fs-extra');
let path;

// Needed for Materialize Design
$(document).ready(function(){
    $('select').material_select();
    $('.carousel.carousel-slider').carousel({fullWidth: true});
});

// Opening event of viewer window
ipcRenderer.on('send-to-viewer', (event, data) => {
    console.log("Path:" + data);
    path = data;
    // Folder listing for viewer window
    fs.readdirSync(path).forEach(file => {
        console.log(file);
        $("#chapterlist").append(
            $("<option>").attr("value", `${file}`).append(`${file}`)
        );  
    });
});

// Will list pages of said manga + IPC event to reload page
function viewManga(){
    let chapter = $("#chapterlist option:selected").val();
    console.log(chapter);
    let chapPath = path + chapter;
    console.log(chapPath);
    ipcRenderer.send('open-chapter', chapPath);
}


// Ipc event that gives the path from main-viewer
ipcRenderer.on('open-chap-reply', (event, data) => {
    console.log("Path:" + data);
    path = data;
    fs.readdirSync(path).filter(function(file) { return file.substr(-4) === '.jpg'; }).forEach(file => {
        $("#chapView").append(
            $("<a>").attr("class", "carousel-item").append(
                $("<img>").attr("src", "../." + path + file)
            )
        );
        console.log(file);
    });
    
});