// Viewer window scripts

const {ipcRenderer} = require('electron');
const fs = require('fs-extra');
let path;

// Needed for Materialize Design
$(document).ready(function(){
    $('.carousel.carousel-slider').carousel({fullWidth: true});
});

// Ipc event that gives the path from main-viewer
ipcRenderer.on('send-to-viewer', (event, data) => {
    console.log("Path:" + data);
    path = data;
    fs.readdirSync(path)/*.filter(function(file) { return file.substr(-4) === '.jpg'; })*/.forEach(file => {
        $("#chapView").append(
            $("<a>").attr("class", "carousel-item").append(
                $("<img>").attr("src", "../." + path + file)
            )
        );
        console.log(file);
    });
    
});

// Test func
function test(){
    console.log(path);
}